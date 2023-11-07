import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  takeUntil,
} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { GridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { GET_RESOURCE_METADATA } from './graphql/queries';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { SummaryCardFormT } from '../summary-card-settings/summary-card-settings.component';
import { Record } from '../../../models/record.model';

export type CardT = NonNullable<SummaryCardFormT['value']['card']> &
  Partial<{
    record: Record;
    metadata: any[];
    layout: Layout;
    cardAggregationData: any;
  }>;
import { Layout } from '../../../models/layout.model';
import { FormControl } from '@angular/forms';
import { clone, isNaN } from 'lodash';
import { searchFilters } from '../../../utils/filter/search-filters';
import { SnackbarService, UIPageChangeEvent } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { ContextService } from '../../../services/context/context.service';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridWidgetComponent } from '../grid/grid.component';
import { GridService } from '../../../services/grid/grid.service';

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/** Default page size for pagination */
const DEFAULT_PAGE_SIZE = 25;

/**
 * Summary Card Widget component.
 */
@Component({
  selector: 'shared-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() widget: any;
  @Input() export = true;
  @Input() settings!: SummaryCardFormT['value'];
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;

  public gridSettings: any = null;

  public displayMode: 'cards' | 'grid' = 'cards';
  // === GRID ===
  public colsNumber = MAX_COL_SPAN;

  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    skip: 0,
  };
  public loading = true;

  public cards: CardT[] = [];
  private cachedCards: CardT[] = [];
  private sortedCachedCards: CardT[] = [];
  private dataQuery!: QueryRef<any>;
  private metaQuery: any;

  private layout: Layout | null = null;
  private fields: any[] = [];
  private metaFields: any[] = [];
  public sortFields: any[] = [];
  private contextFilters: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  /** @returns Get query filter */
  get queryFilter(): CompositeFilterDescriptor {
    let filter: CompositeFilterDescriptor | undefined;
    if (this.searchControl.value) {
      const skippedFields = ['id', 'incrementalId'];
      filter = {
        logic: 'and',
        filters: [
          { logic: 'and', filters: [this.layout?.query.filter] },
          {
            logic: 'or',
            filters: searchFilters(
              this.searchControl.value,
              this.fields,
              skippedFields
            ),
          },
        ],
      };
    } else {
      filter = {
        logic: 'and',
        filters: [this.layout?.query.filter],
      };
    }
    return {
      logic: 'and',
      filters: [
        filter,
        this.contextService.injectDashboardFilterValues(this.contextFilters),
      ],
    };
  }

  public searchControl = new FormControl('');
  public scrolling = false;
  private resizeObserver!: ResizeObserver;

  // used to reset sort options when changing display mode
  public sortControl = new FormControl(null);
  private sortOptions = { field: null, order: '' };

  @ViewChild('summaryCardGrid') summaryCardGrid!: ElementRef<HTMLDivElement>;
  @ViewChild('pdf') pdf!: any;

  /** Reference to grid component, when grid view is activated */
  @ViewChild(GridWidgetComponent) gridComponent?: GridWidgetComponent;

  /**
   * Get the summary card pdf name
   *
   * @returns export name of the summary card
   */
  get exportName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${
      this.settings.title ? this.settings.title : 'Summary Card'
    } ${formatDate}.pdf`;
  }

  /**
   * Constructor for summary card component
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param queryBuilder Query builder service
   * @param gridLayoutService Shared grid layout service
   * @param aggregationService Aggregation service
   * @param contextService ContextService
   * @param elementRef Element Ref
   * @param gridService grid service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private queryBuilder: QueryBuilderService,
    private gridLayoutService: GridLayoutService,
    private aggregationService: AggregationService,
    private contextService: ContextService,
    private elementRef: ElementRef,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    // TODO: Replace once we have a proper UI
    this.contextFilters = this.widget.settings.contextFilters
      ? JSON.parse(this.widget.settings.contextFilters)
      : this.contextFilters;

    this.setupDynamicCards();
    this.setupGridSettings();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.handleSearch(value || '');
      });

    this.contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.onPage({
          pageSize: DEFAULT_PAGE_SIZE,
          skip: 0,
          previousPageIndex: 0,
          pageIndex: 0,
          totalItems: 0,
        });
      });
  }

  ngAfterViewInit(): void {
    if (this.elementRef.nativeElement.parentElement) {
      this.colsNumber = this.setColsNumber(
        this.elementRef.nativeElement.parentElement.clientWidth
      );
      this.resizeObserver = new ResizeObserver(() => {
        this.colsNumber = this.setColsNumber(
          this.elementRef.nativeElement.parentElement.clientWidth
        );
      });
      this.resizeObserver.observe(this.elementRef.nativeElement.parentElement);
    }
    if (!this.settings.widgetDisplay?.usePagination) {
      this.summaryCardGrid.nativeElement.addEventListener(
        'scroll',
        (event: any) => {
          this.loadOnScroll(event);
        }
      );
    }
  }

  /**
   * Changes the display mode and reset the sort.
   *
   * @param value display mode.
   */
  changeDisplayMode(value: 'cards' | 'grid') {
    if (this.displayMode != value) {
      this.sortControl.setValue(null);
      this.onSort(null);
      this.displayMode = value;
    }
  }

  /**
   * Changes the number of displayed columns.
   *
   * @param width width of the screen.
   * @returns new number of cols.
   */
  private setColsNumber(width: number): number {
    if (width <= 480) {
      return 1;
    }
    if (width <= 600) {
      return 2;
    }
    if (width <= 800) {
      return 4;
    }
    if (width <= 1024) {
      return 6;
    }
    return MAX_COL_SPAN;
  }

  /** Gets the query for fetching the dynamic cards records. */
  private async setupDynamicCards() {
    // only one dynamic card is allowed per widget
    const card = this.settings.card;
    if (!card) return;

    if (card.aggregation) this.getCardsFromAggregation(card);
    else if (card.layout) this.createDynamicQueryFromLayout(card);
  }

  /**
   * Handles the search on cards
   *
   * @param search search value
   */
  private handleSearch(search: string) {
    // Only need to fetch data if is dynamic and not an aggregation
    const needRefetch = !this.settings.card?.aggregation;
    const skippedFields = ['id', 'incrementalId'];
    this.pageInfo.pageIndex = 0;
    this.pageInfo.skip = 0;

    if (!needRefetch) {
      this.sortedCachedCards = this.cachedCards.filter((card: any) => {
        const data = clone(card.record || card.cardAggregationData || {});
        skippedFields.forEach((field) => delete data[field]);
        const recordValues = Object.values(data);
        return recordValues.some(
          (value) =>
            (typeof value === 'string' &&
              value.toLowerCase().includes(search.toLowerCase()) &&
              !skippedFields.includes(value)) ||
            (!isNaN(parseFloat(search)) &&
              typeof value === 'number' &&
              value === parseFloat(search))
        );
      });
      this.cards = this.sortedCachedCards.slice(0, this.pageInfo.pageSize);
      this.pageInfo.length = this.sortedCachedCards.length;
    } else {
      this.loading = true;
      this.dataQuery
        ?.refetch({
          skip: 0,
          first: this.pageInfo.pageSize,
          filter: this.queryFilter,
          sortField: this.sortOptions.field,
          sortOrder: this.sortOptions.order,
          ...(this.settings.at && {
            at: this.contextService.atArgumentValue(this.settings.at),
          }),
        })
        .then(this.updateCards.bind(this));
    }
  }

  /**
   * Updates the cards from fetched custom query
   *
   * @param res Query result
   */
  private updateCards(res: any) {
    if (!res?.data) return;
    let newCards: any[] = [];

    const layoutQueryName = this.layout?.query.name;
    if (this.layout) {
      const edges = res.data?.[layoutQueryName].edges;
      if (!edges) return;

      newCards = edges.map((e: any) => ({
        ...this.settings.card,
        record: e.node,
        layout: this.layout,
        metadata: this.fields,
        style: e.meta.style,
      }));
    } else if (this.settings.card?.aggregation) {
      if (!res.data?.recordsAggregation?.items) return;
      newCards = res.data.recordsAggregation.items.map((x: any) => ({
        ...this.settings.card,
        cardAggregationData: x,
      }));
    } else {
      return;
    }

    // scrolling enabled
    if (!this.settings.widgetDisplay?.usePagination && this.scrolling) {
      this.cards = [...this.cards, ...newCards];
      this.scrolling = false;
    } else {
      this.cards = newCards;

      if (this.displayMode == 'cards') {
        this.summaryCardGrid.nativeElement.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
    this.pageInfo.length = get(
      res.data[layoutQueryName ?? 'recordsAggregation'],
      'totalCount',
      0
    );

    this.loading = res.loading;
  }

  /**
   * Gets the query for fetching the dynamic cards records from a card's settings
   *
   * @param card Card settings
   */
  private async createDynamicQueryFromLayout(card: any) {
    // gets metadata
    const metaRes = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: card.resource,
        },
      })
    );

    this.gridLayoutService
      .getLayouts(card.resource, { ids: [card.layout], first: 1 })
      .then((res) => {
        const layouts = res.edges.map((edge) => edge.node);
        if (layouts.length > 0) {
          this.layout = layouts[0];
          const layoutQuery = this.layout.query;
          const builtQuery = this.queryBuilder.buildQuery({
            query: layoutQuery,
          });
          const layoutFields = layoutQuery.fields;
          this.fields = get(metaRes, 'data.resource.metadata', []).map(
            (f: any) => {
              const layoutField = layoutFields.find(
                (lf: any) => lf.name === f.name
              );
              if (layoutField) {
                return { ...layoutField, ...f };
              }
              return f;
            }
          );

          // Set sort fields
          this.sortFields = [];
          this.widget.settings.sortFields?.forEach((sortField: any) => {
            this.sortFields.push(sortField);
          });

          if (builtQuery) {
            this.sortOptions = {
              field: get(this.layout?.query, 'sort.field', null),
              order: get(this.layout?.query, 'sort.order', ''),
            };
            this.dataQuery = this.apollo.watchQuery<any>({
              query: builtQuery,
              variables: {
                first: DEFAULT_PAGE_SIZE,
                filter: this.queryFilter,
                sortField: this.sortOptions.field,
                sortOrder: this.sortOptions.order,
                styles: layoutQuery.style || null,
                ...(this.settings.at && {
                  at: this.contextService.atArgumentValue(this.settings.at),
                }),
              },
              fetchPolicy: 'network-only',
              nextFetchPolicy: 'cache-first',
            });
            this.dataQuery.valueChanges
              .pipe(takeUntil(this.destroy$))
              .subscribe(this.updateCards.bind(this));
          }
          // Build meta query to add information to fields
          this.metaQuery = this.queryBuilder.buildMetaQuery(this.layout.query);
          if (this.metaQuery) {
            this.loading = true;
            this.metaQuery.pipe(takeUntil(this.destroy$)).subscribe({
              next: async ({ data }: any) => {
                for (const field in data) {
                  if (Object.prototype.hasOwnProperty.call(data, field)) {
                    this.metaFields = Object.assign({}, data[field]);
                    try {
                      await this.gridService.populateMetaFields(
                        this.metaFields
                      );
                      this.fields = this.fields.map((field) => {
                        //add shape for columns and matrices
                        const metaData = this.metaFields[field.name];
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
              },
              error: () => {
                this.loading = false;
              },
            });
          }
        }
      });
  }

  /**
   * Set up grid view settings from card definition
   */
  private async setupGridSettings(): Promise<void> {
    const card = this.settings.card;
    if (!card || !card.resource || (!card.layout && !card.aggregation)) return;
    const settings = {
      template: card.template,
      resource: card.resource,
      summaryCard: true,
      actions: {
        //default actions, might need to modify later
        addRecord: get(this.settings, 'actions.addRecord', false),
        convert: get(this.settings, 'actions.convert', true),
        delete: get(this.settings, 'actions.delete', true),
        export: get(this.settings, 'actions.export', true),
        history: get(this.settings, 'actions.history', true),
        inlineEdition: get(this.settings, 'actions.inlineEdition', true),
        showDetails: get(this.settings, 'actions.showDetails', true),
        update: get(this.settings, 'actions.update', true),
        navigateToPage: get(this.settings, 'actions.navigateToPage', false),
        navigateSettings: {
          pageUrl: get(this.settings, 'actions.navigateSettings.pageUrl', ''),
          useRecordId: get(
            this.settings,
            'actions.navigateSettings.useRecordId',
            false
          ),
          title: get(this.settings, 'actions.navigateSettings.title', ''),
        },
      },
      contextFilters: JSON.stringify(this.contextFilters),
    };

    Object.assign(
      settings,
      card.aggregation
        ? { aggregations: card.aggregation }
        : { layouts: card.layout }
    );

    this.gridSettings = settings;
  }

  /**
   * Gets the query for fetching the dynamic cards records from a card's settings
   *
   * @param card Card settings
   */
  private async getCardsFromAggregation(
    card: NonNullable<SummaryCardFormT['value']['card']>
  ) {
    if (!card.aggregation || !card.resource) return;
    this.loading = true;

    this.dataQuery = this.aggregationService.aggregationDataWatchQuery(
      card.resource,
      card.aggregation,
      DEFAULT_PAGE_SIZE,
      0,
      this.contextService.injectDashboardFilterValues(this.contextFilters),
      this.widget.settings.at
        ? this.contextService.atArgumentValue(this.widget.settings.at)
        : undefined
    );

    this.dataQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateCards.bind(this));

    // Set sort fields
    this.sortFields = [];
    this.widget.settings.sortFields?.forEach((sortField: any) => {
      this.sortFields.push(sortField);
    });
  }

  /**
   * Load more items on scroll.
   *
   * @param e scroll event
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.scrolling && this.pageInfo.length > this.cards.length) {
        this.dataQuery
          ?.fetchMore({
            variables: {
              skip: this.cards.length,
            },
          })
          .then(this.updateCards.bind(this));
        this.scrolling = true;
      }
    }
  }

  /**
   * Detects pagination events and update the items loaded.
   *
   * @param event Page change event.
   */
  public onPage(event: UIPageChangeEvent): void {
    this.pageInfo.pageSize = event.pageSize;
    this.pageInfo.skip = event.skip;

    if (this.dataQuery) {
      this.loading = true;
      const layoutQuery = this.layout?.query;
      this.dataQuery
        .refetch({
          first: this.pageInfo.pageSize,
          skip: event.skip,
          filter: this.queryFilter,
          sortField: this.sortOptions.field,
          sortOrder: this.sortOptions.order,
          styles: layoutQuery?.style || null,
          ...(this.settings.at && {
            at: this.contextService.atArgumentValue(this.settings.at),
          }),
        })
        .then(this.updateCards.bind(this));
    }
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resizeObserver.disconnect();
  }

  /**
   * Handles sorting on the cards.
   *
   * @param e Selected sort option.
   */
  public onSort(e: any) {
    if (e) {
      this.sortOptions = { field: e.field, order: e.order };
    } else {
      this.sortOptions = {
        field: get(this.layout?.query, 'sort.field', null),
        order: get(this.layout?.query, 'sort.order', ''),
      };
    }
    if (this.gridComponent) {
      this.gridComponent.onSort(e);
    } else {
      if (!this.dataQuery) return;
      this.dataQuery
        .refetch({
          first: this.pageInfo.pageSize,
          filter: this.queryFilter,
          sortField: this.sortOptions.field,
          sortOrder: this.sortOptions.order,
          ...(this.settings.at && {
            at: this.contextService.atArgumentValue(this.settings.at),
          }),
        })
        .then(() => (this.loading = false));
    }
  }
}
