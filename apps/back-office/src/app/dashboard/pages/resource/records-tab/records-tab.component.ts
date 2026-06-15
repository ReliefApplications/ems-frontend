import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Resource,
  DownloadService,
  UnsubscribeComponent,
  QueryBuilderService,
  GridSettings,
} from '@oort-front/shared';
import { Apollo, gql } from 'apollo-angular';
import { filter, takeUntil } from 'rxjs';

/**
 * Records tab of resource page.
 */
@Component({
  selector: 'app-records-tab',
  templateUrl: './records-tab.component.html',
  styleUrls: ['./records-tab.component.scss'],
})
export class RecordsTabComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /**
   * Resource.
   */
  public resource!: Resource;
  /**
   * Grid settings.
   */
  public gridSettings!: GridSettings;
  /**
   * Default grid layout.
   */
  public defaultLayout: any = {};

  /**
   * Show deleted records.
   */
  public showDeletedRecords = false;
  /**
   * Upload state.
   */
  public showUpload = false;

  /**
   *
   * @param queryBuilder
   * @param router
   * @param route
   * @param downloadService
   * @param apollo
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private router: Router,
    private route: ActivatedRoute,
    private downloadService: DownloadService,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    let parentRoute = this.route.parent;
    let resourceId = '';
    while (parentRoute) {
      const id = parentRoute.snapshot.paramMap.get('id');
      if (id) {
        resourceId = id;
        break;
      }
      parentRoute = parentRoute.parent;
    }

    if (history.state.resource && history.state.resource.queryName && history.state.resource.fields) {
      this.resource = history.state.resource;
      this.waitForQueryBuilder();
    } else if (resourceId) {
      this.loadResource(resourceId);
    }
  }

  /**
   *
   * @param id
   */
  private loadResource(id: string): void {
    this.apollo
      .query<any>({
        query: gql`
          query GetResourceForGrid($id: ID!) {
            resource(id: $id) {
              id
              name
              queryName
              singleQueryName
              canUpdate
              canDelete
              fields
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        if (data?.resource) {
          this.resource = data.resource;
          this.waitForQueryBuilder();
        }
      });
  }

  /**
   *
   */
  private waitForQueryBuilder(): void {
    this.queryBuilder.isDoneLoading$
      .pipe(
        filter((done) => !!done),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.buildGridSettings();
      });
  }

  private buildGridSettings(): void {
    const queryName = this.resource?.queryName || '';
    const fields = this.queryBuilder.getFields(queryName).map((field: any) => {
      if (field.type.kind !== 'SCALAR') {
        const previousTypes = new Set<any>();
        if (this.resource?.name) {
          previousTypes.add(this.resource.name);
        }
        if (field.type.name) {
          previousTypes.add(field.type.name);
        }
        if (field.type.ofType?.name) {
          previousTypes.add(field.type.ofType.name);
        }
        return Object.assign({}, field, {
          fields: this.queryBuilder.deconfineFields(field.type, previousTypes),
        });
      }
      return field;
    });

    const resourceFields = this.resource?.fields || [];
    const customFieldNames = resourceFields.map((rf: any) => rf.name);
    const isResourceField = (fieldName: string) => {
      const fieldDef = resourceFields.find((rf: any) => rf.name === fieldName);
      return fieldDef?.type === 'resource' || fieldDef?.type === 'resources';
    };

    // Build default layout to hide redundant/technical columns
    const layoutFields: any = {};
    const configureLayout = (fieldList: any[], prefix = '') => {
      fieldList.forEach((f) => {
        const name = prefix ? `${prefix}.${f.name}` : f.name;
        const topLevelName = name.split('.')[0];

        // Only show custom fields and incrementalId by default
        let isHidden = true;
        let orderIndex = 9999;

        if (topLevelName === 'incrementalId') {
          isHidden = false;
          orderIndex = customFieldNames.length; // Place at the end, before actions
        } else {
          const idx = customFieldNames.indexOf(topLevelName);
          if (idx !== -1 && !isResourceField(topLevelName)) {
            isHidden = false;
            orderIndex = idx;
          }
        }

        // Width is omitted so that column size is dynamically calculated based on content
        layoutFields[name] = {
          hidden: isHidden,
          order: orderIndex,
        };

        if (f.fields && f.fields.length > 0) {
          configureLayout(f.fields, name);
        }
      });
    };

    configureLayout(fields);
    this.defaultLayout = {
      fields: layoutFields,
    };

    this.gridSettings = {
      query: {
        name: queryName,
        fields,
        archived: this.showDeletedRecords,
      },
      actions: {
        update: !this.showDeletedRecords,
        delete: true,
        history: false,
        convert: false,
        remove: false,
        restore: this.showDeletedRecords,
        navigateToPage: true,
        search: false,
        export: true,
      },
    };
  }

  /**
   *
   */
  onSwitchView(): void {
    this.showDeletedRecords = !this.showDeletedRecords;
    this.buildGridSettings();
  }

  /**
   *
   * @param event
   */
  onUpdateRecord(event: any): void {
    this.router.navigate(['update', event.id], { relativeTo: this.route });
  }

  /**
   * Downloads the list of records of the resource.
   *
   * @param type Type of the document to download ( excel or csv ).
   */
  onDownload(type: string): void {
    const path = `download/resource/records/${this.resource.id}`;
    const fileName = `${this.resource.name}.${type}`;
    const queryString = new URLSearchParams({
      type,
      archived: String(this.showDeletedRecords),
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      fileName
    );
  }

  /**
   * Get the records template, for upload.
   */
  onDownloadTemplate(): void {
    const path = `download/resource/records/${this.resource.id}`;
    const queryString = new URLSearchParams({
      type: 'xlsx',
      template: 'true',
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/xlsx;charset=utf-8;`,
      `${this.resource.name}_template.xlsx`
    );
  }

  /**
   * Calls rest endpoint to upload new records for the resource.
   *
   * @param file File to upload.
   */
  uploadFileData(file: any): void {
    const path = `upload/resource/records/${this.resource.id}`;
    this.downloadService.uploadFile(path, file).subscribe({
      next: ({ status }) => {
        if (status === 'OK') {
          this.showUpload = false;
          this.buildGridSettings();
        }
      },
      error: () => {
        // The error message has already been handled in DownloadService
        this.showUpload = false;
      },
    });
  }
}
