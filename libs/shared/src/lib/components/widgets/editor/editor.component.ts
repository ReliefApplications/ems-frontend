import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  Renderer2,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { clone, get, isEmpty, isEqual, isNil, set } from 'lodash';
import {
  Subject,
  debounceTime,
  filter,
  firstValueFrom,
  from,
  takeUntil,
} from 'rxjs';
import { ReferenceData } from '../../../models/reference-data.model';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { ContextService } from '../../../services/context/context.service';
import { DataTemplateService } from '../../../services/data-template/data-template.service';
import { GridService } from '../../../services/grid/grid.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';
import { WidgetService } from '../../../services/widget/widget.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { HtmlWidgetContentComponent } from '../common/html-widget-content/html-widget-content.component';
import {
  GET_LAYOUT,
  GET_RESOURCE_METADATA,
} from '../summary-card/graphql/queries';
import { DashboardAutomationService } from '../../../services/dashboard-automation/dashboard-automation.service';

/**
 * Text widget component using Tinymce.
 */
@Component({
  selector: 'shared-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent extends BaseWidgetComponent implements OnInit {
  /** Widget settings */
  @Input() settings: any;
  /** Should show padding */
  @Input() usePadding = true;
  /** Reference to html content component */
  @ViewChild(HtmlWidgetContentComponent)
  htmlContentComponent!: HtmlWidgetContentComponent;
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
  /** Result of aggregations */
  public aggregationsData: any = {};
  /** Loading indicator */
  public loading = true;
  /** Subject to emit signals for cancelling previous data queries */
  private cancelRefresh$ = new Subject<void>();
  /** Timeout to init active filter */
  private timeoutListener!: NodeJS.Timeout;

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

  /** @returns available aggregations */
  get aggregations() {
    return this.settings.aggregations || [];
  }

  /**
   * Listen to click events from host element, and trigger any action attached to the content clicked in the editor
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    this.widgetService.handleWidgetContentClick(
      event,
      'shared-editor',
      this.dashboardAutomationService,
      this.settings.automationRules
    );
    const content = this.htmlContentComponent.el.nativeElement;
    const editorTriggers = content.querySelectorAll('.record-editor');
    editorTriggers.forEach((recordEditor: HTMLElement) => {
      if (recordEditor.contains(event.target)) {
        this.openEditRecordModal();
      }
    });
  }

  /**
   * Text widget component using Tinymce.
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
   * @param aggregationService Shared aggregation service
   * @param el Element ref
   * @param router Angular router
   * @param widgetService Shared widget service
   * @param dashboardAutomationService Dashboard automation service (Optional, so not active while editing widget)
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
    private renderer: Renderer2,
    private aggregationService: AggregationService,
    private el: ElementRef,
    private router: Router,
    private widgetService: WidgetService,
    @Optional()
    @SkipSelf()
    private dashboardAutomationService: DashboardAutomationService
  ) {
    super();
  }

  /** Sanitizes the text. */
  async ngOnInit(): Promise<void> {
    this.setHtml();

    // Gather all context filters in a single text value
    const allContextFilters = this.aggregations
      .map((aggregation: any) => aggregation.contextFilters)
      .join('');
    const allQueryParams = this.aggregations
      .map((aggregation: any) => aggregation.referenceDataVariableMapping)
      .join('');
    // Listen to dashboard filters changes if it is necessary
    this.contextService.filter$
      .pipe(
        // On working with web components we want to send filter value if this current element is in the DOM
        // Otherwise send value always
        filter(() =>
          this.contextService.shadowDomService.isShadowRoot
            ? this.contextService.shadowDomService.currentHost.contains(
                this.el.nativeElement
              )
            : true
        ),
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(({ previous, current }) => {
        if (
          this.contextService.filterRegex.test(
            allContextFilters + allQueryParams
          )
        ) {
          if (
            this.contextService.shouldRefresh(this.settings, previous, current)
          ) {
            this.cancelRefresh$.next();
            this.loading = true;
            this.setHtml();
          }
        }
        this.toggleActiveFilters(
          current,
          this.htmlContentComponent?.el.nativeElement
        );
      });
  }

  /**
   * Set the elements as active if matching dashboard filter
   *
   * @param filterValue value of the current dashboard filter
   * @param node HTML element
   */
  private toggleActiveFilters = (filterValue: any, node: any) => {
    /**
     * Should activate or deactivate the active status of the field, based on other filter fields
     * If other field fields are set, then, deactivate the field
     *
     * @param node html node
     */
    const shouldActivate = (node: any): void => {
      const deactivatingFields = get(node, 'dataset.filterDeactivate');
      if (deactivatingFields) {
        if (
          deactivatingFields
            .split(';')
            .map((item: any) => item.trim())
            .some((field: any) => !isNil(get(filterValue, field)))
        ) {
          node.dataset.filterActive = false;
          return;
        }
      }
      node.dataset.filterActive = true;
    };

    if (get(node, 'dataset.filterField')) {
      const value = get(node, 'dataset.filterValue');
      const filterFieldValue = get(filterValue, node.dataset.filterField);
      const isNilOrEmpty = (x: any) => isNil(x) || x === '';
      if (
        isEqual(value, filterFieldValue) ||
        (isNilOrEmpty(value) && isNilOrEmpty(filterFieldValue))
      ) {
        shouldActivate(node);
      } else {
        node.dataset.filterActive = false;
      }
    } else {
      // Handle empty filters. Need to leave filter field empty.
      if (get(node, 'dataset.filterField') === '') {
        if (!filterValue || isEmpty(filterValue)) {
          shouldActivate(node);
        } else {
          node.dataset.filterActive = false;
        }
      }
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      this.toggleActiveFilters(filterValue, child);
    }
  };

  /**
   * Set widget html.
   */
  private setHtml() {
    const callback = () => {
      if (this.timeoutListener) {
        clearTimeout(this.timeoutListener);
      }
      // Necessary because ViewChild is not initialized immediately
      this.timeoutListener = setTimeout(() => {
        this.toggleActiveFilters(
          this.contextService.filter.getValue(),
          this.htmlContentComponent.el.nativeElement
        );
        const anchorElements = this.el.nativeElement.querySelectorAll('a');
        anchorElements.forEach((anchor: HTMLElement) => {
          this.renderer.listen(anchor, 'click', (event: Event) => {
            // Prevent the default behavior of the anchor tag
            event.preventDefault();
            // Use the Angular Router to navigate to the desired route ( if needed )
            const href = anchor.getAttribute('href');
            const target = anchor.getAttribute('target');
            if (href) {
              if (target === '_blank') {
                // Open link in a new tab, don't use Angular router
                window.open(href, '_blank');
              } else {
                if (href?.startsWith('./')) {
                  // Navigation inside the app builder
                  this.router.navigateByUrl(href.substring(1));
                } else {
                  // Default navigation
                  window.location.href = href;
                }
              }
            }
          });
        });
      }, 500);
    };
    if (this.settings.record && this.settings.resource) {
      from(
        Promise.all([
          new Promise<void>((resolve) => {
            this.getLayout()
              .then(() => this.getRecord().finally(() => resolve()))
              .catch(() => resolve());
          }),
          this.getAggregationsData(),
        ])
      )
        .pipe(takeUntil(this.cancelRefresh$))
        .subscribe(() => {
          this.formattedStyle = this.dataTemplateService.renderStyle(
            this.settings.wholeCardStyles || false,
            this.fieldsValue,
            this.styles
          );
          this.formattedHtml = this.dataTemplateService.renderHtml(
            this.settings.text,
            {
              data: this.fieldsValue,
              aggregation: this.aggregations,
              fields: this.fields,
              styles: this.styles,
            }
          );
          this.loading = false;
          callback();
        });
    } else if (this.settings.element && this.settings.referenceData) {
      from(
        Promise.all([
          new Promise<void>((resolve) => {
            this.referenceDataService
              .cacheItems(this.settings.referenceData)
              .then(({ items, referenceData }) => {
                this.referenceData = referenceData;
                this.fields = (referenceData.fields || [])
                  .filter((field: any) => field && typeof field !== 'string')
                  .map((field: any) => {
                    return {
                      label: field.name,
                      name: field.name,
                      type: field.type,
                    };
                  });
                if (items) {
                  const field = this.referenceData?.valueField;
                  const selectedItemKey = String(this.settings.element);
                  if (field) {
                    this.fieldsValue = items.find(
                      (x: any) => String(get(x, field)) === selectedItemKey
                    );
                  }
                }
              })
              .catch(() => resolve())
              .finally(() => resolve());
          }),
          this.getAggregationsData(),
        ])
      )
        .pipe(takeUntil(this.cancelRefresh$))
        .subscribe(() => {
          this.formattedHtml = this.dataTemplateService.renderHtml(
            this.settings.text,
            {
              data: this.fieldsValue,
              aggregation: this.aggregations,
              fields: this.fields,
            }
          );
          this.loading = false;
          callback();
        });
    } else {
      from(Promise.all([this.getAggregationsData()]))
        .pipe(takeUntil(this.cancelRefresh$))
        .subscribe(() => {
          this.formattedHtml = this.dataTemplateService.renderHtml(
            this.settings.text,
            {
              data: this.fieldsValue,
              aggregation: this.aggregations,
              fields: this.fields,
            }
          );
          this.loading = false;
          callback();
        });
    }
  }

  /**
   * Get all aggregations data
   *
   * @returns promise
   */
  private getAggregationsData() {
    const promises: Promise<void>[] = [];
    this.aggregations.forEach((aggregation: any) => {
      promises.push(
        new Promise<void>((resolve) => {
          firstValueFrom(
            this.aggregationService.aggregationDataQuery({
              resource: aggregation.resource,
              referenceData: aggregation.referenceData,
              aggregation: aggregation.aggregation,
              contextFilters: aggregation.contextFilters
                ? JSON.parse(aggregation.contextFilters)
                : {},
              queryParams: this.widgetService.replaceReferenceDataQueryParams(
                aggregation.referenceDataVariableMapping
              ),
              at: this.contextService.atArgumentValue(aggregation.at),
            })
          )
            .then(({ data }) => {
              if (aggregation.resource) {
                set(
                  this.aggregations,
                  aggregation.id,
                  (data as any).recordsAggregation
                );
              } else {
                set(
                  this.aggregations,
                  aggregation.id,
                  (data as any).referenceDataAggregation
                );
              }
            })
            .finally(() => resolve());
        })
      );
    });
    return Promise.all(promises);
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
          this.loading = true;
          // Update the record, based on new configuration
          this.getRecord()
            .then(() => {
              this.formattedStyle = this.dataTemplateService.renderStyle(
                this.settings.wholeCardStyles || false,
                this.fieldsValue,
                this.styles
              );
              this.formattedHtml = this.dataTemplateService.renderHtml(
                this.settings.text,
                {
                  data: this.fieldsValue,
                  aggregation: this.aggregations,
                  fields: this.fields,
                  styles: this.styles,
                }
              );
            })
            .finally(() => (this.loading = false));
        }
      });
    }
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
                //add choices for people questions
                if (metaData && metaData.choices) {
                  return {
                    ...field,
                    choices: metaData.choices,
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
