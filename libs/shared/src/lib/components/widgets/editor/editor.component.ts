import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  HostListener,
  Renderer2,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { firstValueFrom, takeUntil } from 'rxjs';
import {
  GET_LAYOUT,
  GET_RESOURCE_METADATA,
} from '../summary-card/graphql/queries';
import { clone, get, isNil } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { DataTemplateService } from '../../../services/data-template/data-template.service';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { GridService } from '../../../services/grid/grid.service';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../models/reference-data.model';
import { GET_REFERENCE_DATA } from './graphql/queries';
import { HtmlWidgetContentComponent } from '../common/html-widget-content/html-widget-content.component';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { ContextService } from '../../../services/context/context.service';

/**
 * Text widget component using KendoUI
 */
@Component({
  selector: 'shared-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent extends UnsubscribeComponent implements OnInit {
  /** Widget settings */
  @Input() settings: any;
  /** Should show padding */
  @Input() usePadding = true;

  /** Layout */
  private layout: any;
  /** Record */
  private record?: any;
  /** Configured reference data */
  private referenceData?: ReferenceData;
  /** Fields */
  private fields: any[] = [];
  /** Fields value */
  private fieldsValue: any;
  /** Styles */
  private styles: any[] = [];
  /** Should use whole card styles */
  private wholeCardStyles = false;

  /** Formatted html */
  public formattedHtml: SafeHtml = '';
  /** Formatted style */
  public formattedStyle?: string;

  /** Reference to header template */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  /** Reference to html content component */
  @ViewChild(HtmlWidgetContentComponent)
  htmlContentComponent!: HtmlWidgetContentComponent;

  /** @returns does the card use reference data */
  get useReferenceData() {
    return !isNil(this.settings.referenceData);
  }

  /** @returns should show data source button */
  get showDataSourceButton() {
    return (
      (this.settings.showDataSourceLink || false) && !this.useReferenceData
    );
  }

  /**
   * Constructor for shared-editor component
   *
   * @param apollo Apollo instance
   * @param queryBuilder Query builder service
   * @param dataTemplateService Shared data template service, used to render content from template
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param gridService Shared grid service
   * @param referenceDataService Shared reference data service
   * @param contextService Context service
   * @param renderer Angular renderer2 service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private dataTemplateService: DataTemplateService,
    private dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private gridService: GridService,
    private referenceDataService: ReferenceDataService,
    private contextService: ContextService,
    private renderer: Renderer2
  ) {
    super();
  }

  /** Sanitizes the text. */
  async ngOnInit(): Promise<void> {
    if (this.settings.record && this.settings.resource) {
      await this.getLayout();
      await this.getRecord();
      this.formattedStyle = this.dataTemplateService.renderStyle(
        this.settings.wholeCardStyles || false,
        this.fieldsValue,
        this.styles
      );
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text,
        this.fieldsValue,
        this.fields,
        this.styles
      );
    } else if (this.settings.element && this.settings.referenceData) {
      await this.getReferenceData();
      await this.referenceDataService
        .cacheItems(this.settings.referenceData)
        .then((value) => {
          if (value) {
            const field = this.referenceData?.valueField;
            const selectedItemKey = String(this.settings.element);
            if (field) {
              this.fieldsValue = value.find(
                (x: any) => String(get(x, field)) === selectedItemKey
              );
            }
          }
        });
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text,
        this.fieldsValue,
        this.fields
      );
    } else {
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text
      );
    }
  }

  /**
   * Listen to click events from host element, if record editor is clicked, open record editor modal
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    let filterButtonIsClicked = !!event.target.dataset.filterField;
    let currentNode = event.target;
    if (!filterButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (
        currentNode.localName !== 'shared-editor' &&
        !filterButtonIsClicked
      ) {
        currentNode = this.renderer.parentNode(currentNode);
        filterButtonIsClicked = !!currentNode.dataset.filterField;
      }
    }
    if (filterButtonIsClicked) {
      const { filterField, filterValue } = currentNode.dataset;
      // Cleanup filter value from the span set by default in the tinymce calculated field if exists
      const cleanContent = filterValue.match(/(?<=>)(.*?)(?=<)/gi);
      const cleanFilterValue = cleanContent ? cleanContent[0] : filterValue;
      const currentFilters = { ...this.contextService.filter.getValue() };
      // If current filters contains the field but there is no value set, delete it
      if (filterField in currentFilters && !cleanFilterValue) {
        delete currentFilters[filterField];
      }
      // Update filter object with existing fields and values
      const updatedFilters = {
        ...(currentFilters && { ...currentFilters }),
        ...(cleanFilterValue && {
          [filterField]: cleanFilterValue,
        }),
      };
      this.contextService.filter.next(updatedFilters);
    } else {
      const content = this.htmlContentComponent.el.nativeElement;
      const editorTriggers = content.querySelectorAll('.record-editor');
      editorTriggers.forEach((recordEditor: HTMLElement) => {
        if (recordEditor.contains(event.target)) {
          this.openEditRecordModal();
        }
      });
    }
  }

  /**
   * Open edit record modal.
   */
  private async openEditRecordModal() {
    if (this.record && this.record.canUpdate) {
      const { FormModalComponent } = await import(
        '../../form-modal/form-modal.component'
      );
      const dialogRef = this.dialog.open(FormModalComponent, {
        disableClose: true,
        data: {
          recordId: this.record.id,
          // template: this.settings.template || null,
          template: null,
        },
        autoFocus: false,
      });
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value) {
          // Update the record, based on new configuration
          this.getRecord().then(() => {
            this.formattedStyle = this.dataTemplateService.renderStyle(
              this.settings.wholeCardStyles || false,
              this.fieldsValue,
              this.styles
            );
            this.formattedHtml = this.dataTemplateService.renderHtml(
              this.settings.text,
              this.fieldsValue,
              this.fields,
              this.styles
            );
          });
        }
      });
    }
  }

  /**
   * Get reference data.
   */
  private async getReferenceData() {
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id: this.settings.referenceData,
        },
      })
      .subscribe(({ data }) => {
        if (data.referenceData) {
          this.referenceData = data.referenceData;
          this.fields = (data.referenceData.fields || [])
            .filter((field) => field && typeof field !== 'string')
            .map((field) => {
              return {
                label: field.name,
                name: field.name,
                type: field.type,
              };
            });
        }
      });
  }

  /** Sets layout */
  private async getLayout(): Promise<void> {
    const apolloRes = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id: this.settings.layout,
          resource: this.settings.resource,
        },
      })
    );

    if (get(apolloRes, 'data')) {
      this.layout = apolloRes.data.resource.layouts?.edges[0]?.node;
      if (this.settings.useStyles) {
        this.styles = this.layout?.query.style;
      }
    }
  }

  /**
   * Queries the data.
   */
  private async getRecord() {
    const metaRes = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: this.settings.resource,
        },
      })
    );
    const queryName = get(metaRes, 'data.resource.queryName');

    const builtQuery = this.queryBuilder.buildQuery({
      query: this.layout.query,
    });
    const layoutFields = this.layout.query.fields;
    this.fields = get(metaRes, 'data.resource.metadata', []).map((f: any) => {
      const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
      if (layoutField) {
        return { ...layoutField, ...f };
      }
      return f;
    });

    if (builtQuery) {
      const res = await firstValueFrom(
        this.apollo.query<any>({
          query: builtQuery,
          variables: {
            first: 1,
            filter: {
              // get only the record we need
              logic: 'and',
              filters: [
                {
                  field: 'id',
                  operator: 'eq',
                  value: this.settings.record,
                },
              ],
            },
          },
        })
      );
      this.record = get(res.data, `${queryName}.edges[0].node`, null);
      this.fieldsValue = { ...this.record };
      const metaQuery = this.queryBuilder.buildMetaQuery(this.layout.query);
      if (metaQuery) {
        const metaData = await firstValueFrom(metaQuery);
        for (const field in metaData.data) {
          if (Object.prototype.hasOwnProperty.call(metaData.data, field)) {
            const metaFields = Object.assign({}, metaData.data[field]);
            try {
              await this.gridService.populateMetaFields(metaFields);
              this.fields = this.fields.map((field) => {
                //add shape for columns and matrices
                const metaData = metaFields[field.name];
                if (metaData && (metaData.columns || metaData.rows)) {
                  return {
                    ...field,
                    columns: metaData.columns,
                    rows: metaData.rows,
                  };
                }
                return field;
              });
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    }
  }

  /**
   * Pass click event to data template service
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }

  /**
   * Open the dataSource modal.
   */
  public async openDataSource(): Promise<void> {
    if (this.layout?.query) {
      const { ResourceGridModalComponent } = await import(
        '../../search-resource-grid-modal/search-resource-grid-modal.component'
      );
      this.dialog.open(ResourceGridModalComponent, {
        data: {
          gridSettings: clone(this.layout.query),
        },
      });
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'components.widget.summaryCard.errors.invalidSource'
        ),
        { error: true }
      );
    }
  }
}
