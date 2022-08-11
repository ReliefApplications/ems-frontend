import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SafeDownloadService,
  SafeSnackBarService,
  Record,
  SafeBreadcrumbService,
} from '@safe/builder';
import {
  EditResourceMutationResponse,
  EDIT_RESOURCE,
} from './graphql/mutations';
import {
  GetResourceByIdQueryResponse,
  GetResourceRecordsQueryResponse,
  GET_RESOURCE_BY_ID,
  GET_RESOURCE_RECORDS,
} from './graphql/queries';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 * Quantity of resource that will be loaded at once.
 */
const ITEMS_PER_PAGE = 10;
/**
 * Default fields for the records.
 */
const RECORDS_DEFAULT_COLUMNS = ['_incrementalId', '_actions'];

/**
 * Array of tab names sorted by position index.
 */
const ROUTE_TABS: string[] = ['records', 'forms', 'layouts'];

/**
 * Component used to display resource in a table.
 */
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent implements OnInit, OnDestroy {
  // === DATA ===
  private resourceSubscription?: Subscription;
  private recordsSubscription?: Subscription;
  private recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;
  public loading = true;
  public loadingMore = false;
  public id = '';
  public resource: any;
  public cachedRecords: Record[] = [];
  public selectedTab = 0;

  // === RECORDS ASSOCIATED ===
  recordsDefaultColumns: string[] = RECORDS_DEFAULT_COLUMNS;
  displayedColumnsRecords: string[] = [];
  dataSourceRecords: any[] = [];

  // === FORMS ASSOCIATED ===
  dataSourceForms: any[] = [];

  // === LAYOUTS ===
  dataSourceLayouts: any[] = [];

  // === SHOW DELETED RECORDS ===
  showDeletedRecords = false;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  @ViewChild('xlsxFile') xlsxFile: any;

  public showUpload = false;

  /**
   * ResourceComponent constructor.
   *
   * @param apollo Used to load the resources.
   * @param route Used to get route arguments.
   * @param router Used to change app route.
   * @param snackBar Service used to show a snackbar.
   * @param downloadService Service used to download.
   * @param translate Service used to get translations.
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private translate: TranslateService,
    private breadcrumbService: SafeBreadcrumbService
  ) {}

  /** Load data from the id of the resource passed as a parameter. */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getResourceData();
    } else {
      this.router.navigate(['/resources']);
    }
    const routeTab: any = this.router.url.split('/').pop();
    this.selectedTab = ROUTE_TABS.findIndex((tab) => tab === routeTab);
  }

  /**
   * Loads resource data.
   */
  private getResourceData(): void {
    this.loading = true;
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
    }

    // get the records according to the open resource
    this.recordsQuery = this.apollo.watchQuery<GetResourceRecordsQueryResponse>(
      {
        query: GET_RESOURCE_RECORDS,
        variables: {
          first: ITEMS_PER_PAGE,
          id: this.id,
          display: false,
          showDeletedRecords: this.showDeletedRecords,
        },
      }
    );
    this.recordsSubscription = this.recordsQuery.valueChanges.subscribe(
      (res) => {
        this.cachedRecords.push(
          ...res.data.resource.records.edges.map((x) => x.node)
        );
        this.dataSourceRecords = this.cachedRecords.slice(
          ITEMS_PER_PAGE * this.pageInfo.pageIndex,
          ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res.data.resource.records.totalCount;
        this.pageInfo.endCursor = res.data.resource.records.pageInfo.endCursor;
        this.loadingMore = false;
      }
    );

    // get the resource and the form linked
    this.resourceSubscription = this.apollo
      .watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .valueChanges.subscribe(
        (res) => {
          if (res.data.resource) {
            this.resource = res.data.resource;
            this.breadcrumbService.setBreadcrumb(
              '@resource',
              this.resource.name as string
            );
            this.dataSourceForms = this.resource.forms;
            this.dataSourceLayouts = this.resource.layouts;
            this.setDisplayedColumns(false);
            this.loading = res.loading;
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.accessNotProvided', {
                type: this.translate
                  .instant('common.resource.one')
                  .toLowerCase(),
                error: '',
              }),
              { error: true }
            );
            this.router.navigate(['/resources']);
          }
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/resources']);
        }
      );
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (
      e.pageIndex > e.previousPageIndex &&
      e.length > this.cachedRecords.length &&
      ITEMS_PER_PAGE * this.pageInfo.pageIndex >= this.cachedRecords.length
    ) {
      this.loadingMore = true;
      this.recordsQuery.refetch({
        id: this.id,
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor,
      });
    } else {
      this.dataSourceRecords = this.cachedRecords.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
    }
  }

  /**
   * Changes the list of displayed columns.
   *
   * @param core Is the form core.
   */
  private setDisplayedColumns(core: boolean): void {
    let columns = [];
    if (core) {
      for (const field of this.resource.fields.filter(
        (x: any) => x.isRequired === true
      )) {
        columns.push(field.name);
      }
    } else {
      for (const field of this.resource.fields) {
        columns.push(field.name);
      }
    }
    columns = columns.concat(RECORDS_DEFAULT_COLUMNS);
    this.displayedColumnsRecords = columns;
  }

  /**
   * Filters the shown columns.
   *
   * @param event Event trigger on filtering.
   */
  public filterCore(event: any): void {
    this.setDisplayedColumns(event.value);
  }

  /**
   * Edits the permissions layer.
   *
   * @param e New permissions.
   */
  saveAccess(e: any): void {
    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE,
        variables: {
          id: this.id,
          permissions: e,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.resource = res.data.editResource;
        }
      });
  }

  /**
   * Downloads the list of records of the resource.
   *
   * @param type Type of the document to download ( excel or csv ).
   */
  onDownload(type: string): void {
    const path = `download/resource/records/${this.id}`;
    const fileName = `${this.resource.name}.${type}`;
    const queryString = new URLSearchParams({ type }).toString();
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
   * Detects changes on the file.
   *
   * @param event new file event.
   */
  onFileChange(event: any): void {
    const file = event.files[0].rawFile;
    this.uploadFileData(file);
  }

  /**
   * Calls rest endpoint to upload new records for the resource.
   *
   * @param file File to upload.
   */
  uploadFileData(file: any): void {
    const path = `upload/resource/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe(
      (res) => {
        this.xlsxFile.clearFiles();
        if (res.status === 'OK') {
          this.getResourceData();
          this.showUpload = false;
        }
      },
      (error: any) => {
        this.snackBar.openSnackBar(error.error, { error: true });
        // this.xlsxFile.clearFiles();
        this.showUpload = false;
      }
    );
  }

  /**
   * Toggle archive / active view.
   *
   * @param e click event.
   */
  onSwitchView(e: any): void {
    e.stopPropagation();
    this.showDeletedRecords = !this.showDeletedRecords;
    this.getResourceData();
  }

  /**
   * Changes the route on tab change.
   *
   * @param e click event.
   */
  onTabChanged(e: any) {
    const tab = ROUTE_TABS[e.index];
    const route = this.router.url.split('/').slice(0, -1).join('/') + '/' + tab;
    this.router.navigate([route]);
  }

  /**
   * Unsubscribe to subscriptions before destroying component.
   */
  ngOnDestroy(): void {
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }
  }
}
