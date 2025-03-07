import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  merge,
  takeUntil,
} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { GridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { GET_RESOURCE_METADATA } from './graphql/queries';
import { SummaryCardFormT } from '../summary-card-settings/summary-card-settings.component';
import { Record } from '../../../models/record.model';

export type CardT = NonNullable<SummaryCardFormT['value']['card']> &
  Partial<{
    index: number;
    record: Record;
    metadata: any[];
    layout: Layout;
    rawValue: any;
  }>;
import { Layout } from '../../../models/layout.model';
import { FormControl } from '@angular/forms';
import { clone, cloneDeep, isNaN, isNil } from 'lodash';
import { SnackbarService, UIPageChangeEvent } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { ContextService } from '../../../services/context/context.service';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridWidgetComponent } from '../grid/grid.component';
import { GridService } from '../../../services/grid/grid.service';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';
import searchFilters from '../../../utils/filter/search-filters';
import filterReferenceData from '../../../utils/filter/reference-data-filter.util';
import { ReferenceData } from '../../../models/reference-data.model';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { PageSizeChangeEvent } from '@progress/kendo-angular-pager';
import { WidgetService } from '../../../services/widget/widget.service';

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/** Key to store user selected page size, in local storage */
const SELECTED_PAGE_SIZE_KEY = 'selectedPageSize';

/**
 * Summary Card Widget component.
 */
@Component({
  selector: 'shared-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent
  extends BaseWidgetComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** Widget definition */
  @Input() widget: any;
  /** Widget settings */
  @Input() settings!: SummaryCardFormT['value'];
  /** Should show padding */
  @Input() usePadding = true;
  /** Reference to summary card grid */
  @ViewChild('summaryCardGrid') summaryCardGrid!: ElementRef<HTMLDivElement>;
  /** Reference to pdf */
  @ViewChild('pdf') pdf!: any;
  /** Reference to grid component, when grid view is activated */
  @ViewChild(GridWidgetComponent) gridComponent?: GridWidgetComponent;
  /** Grid settings */
  public gridSettings: any = null;
  /** Current display mode */
  public displayMode: 'cards' | 'grid' = 'cards';
  /** Number of cols in the cards grid */
  public colsNumber = MAX_COL_SPAN;
  /** Pagination info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: this.defaultPageSize,
    length: 0,
    skip: 0,
    lastCursor: null as any,
  };
  /** Reference data datasource */
  public refData: ReferenceData | null = null;
  /** Loading indicators */
  public loading = true;
  /** Available cards */
  public cards: CardT[] = [];
  /** Cached cards */
  private cachedCards: CardT[] = [];
  /** Sorted cards */
  private sortedCachedCards: CardT[] = [];
  /** Apollo data query */
  private dataQuery!: QueryRef<any>;
  /** Apollo meta query */
  private metaQuery: any;
  /** Current layout */
  private layout: Layout | null = null;
  /** Available fields */
  private fields: any[] = [];
  /** Meta fields */
  private metaFields: any[] = [];
  /** Flag indicating we’ve navigated to the last element in pagination */
  private finalPage = false;
  /** Available sort fields */
  public sortFields: any[] = [];
  /** Active context fields */
  private contextFilters: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };
  /** Search control */
  public searchControl = new FormControl('');
  /** Is scrolling */
  public scrolling = false;
  /** Is refresh card list action */
  private triggerRefreshCardList = false;
  /** Observer resize changes */
  private resizeObserver!: ResizeObserver;
  /** Used to reset sort options when changing display mode */
  public sortControl = new FormControl(null);
  /** Current sort */
  private sortOptions: {
    field: string | null;
    order: string;
  } = { field: null, order: '' };
  /** Summary card grid scroll event listener */
  private scrollEventListener!: any;
  /** Timeout listener for summary card scroll bind set on view switch */
  private scrollEventBindTimeout!: NodeJS.Timeout;
  /** Subject to emit signals for cancelling previous data queries */
  private cancelRefresh$ = new Subject<void>();

  /** @returns Get query filter */
  get queryFilter(): CompositeFilterDescriptor {
    let filter: CompositeFilterDescriptor | undefined;
    const skippedFields = ['id', 'incrementalId'];
    if (this.searchControl.value) {
      filter = {
        logic: 'and',
        filters: [
          {
            logic: 'or',
            field: '_globalSearch',
            operator: 'contains',
            value: searchFilters(
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
        filters: this.layout?.query.filter ? [this.layout?.query.filter] : [],
      };
    }
    return {
      logic: 'and',
      filters: [filter, this.contextService.injectContext(this.contextFilters)],
    };
  }

  /** @returns does the card use resource aggregation */
  get useAggregation() {
    return !isNil(this.settings.card?.aggregation);
  }

  /** @returns does the card use resource layout */
  get useLayout() {
    return !isNil(this.settings.card?.layout);
  }

  /** @returns does the card use reference data */
  get useReferenceData() {
    return !isNil(this.settings.card?.referenceData);
  }

  /** @returns should show data source button */
  get showDataSourceButton() {
    return (
      ((this.settings.card?.showDataSourceLink &&
        this.displayMode === 'cards') ||
        false) &&
      !this.useReferenceData
    );
  }

  /** @returns user can change display mode */
  get canChangeDisplayMode() {
    return get(this.settings, 'widgetDisplay.gridMode', true);
  }

  /** @returns is widget exportable ( only cards mode ) */
  get exportable() {
    return get(this.settings, 'widgetDisplay.exportable', true);
  }

  /** @returns default page size, for initialization */
  private get defaultPageSize(): number {
    const selectedPageSize = localStorage.getItem(SELECTED_PAGE_SIZE_KEY);
    if (selectedPageSize) {
      return Number(selectedPageSize);
    } else {
      const windowHeight = window.innerHeight;
      switch (true) {
        case windowHeight < 600: {
          return 10;
        }
        case windowHeight >= 600 && windowHeight < 1200: {
          return 25;
        }
        case windowHeight >= 1200 && windowHeight < 1800: {
          return 50;
        }
        case windowHeight >= 1800: {
          return 100;
        }
        default: {
          return 25;
        }
      }
    }
  }

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

  /** @returns whether or not we know how many items there are in total */
  get totalItemsKnown(): boolean {
    return this.pageInfo.length !== Number.MAX_SAFE_INTEGER;
  }

  /** @returns reference data (graphql or rest) query params */
  get queryParams() {
    return this.widgetService.replaceReferenceDataQueryParams(
      this.settings.card?.referenceDataVariableMapping as any,
      this.replaceWidgetVariables.bind(this)
    );
  }

  /**
   * Summary Card Widget component.
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
   * @param referenceDataService Shared reference data service
   * @param renderer Angular renderer service
   * @param dashboardService Shared dashboard service
   * @param widgetService Shared widget service
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
    private gridService: GridService,
    private referenceDataService: ReferenceDataService,
    private renderer: Renderer2,
    private dashboardService: DashboardService,
    private widgetService: WidgetService
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

    // Listen to dashboard filters changes if it is necessary
    if (
      this.contextService.filterRegex.test(
        this.widget.settings.contextFilters
      ) ||
      this.contextService.filterRegex.test(
        this.widget?.settings?.card?.referenceDataVariableMapping
      )
    ) {
      this.contextService.filter$
        .pipe(
          // On working with web components we want to send filter value if this current element is in the DOM
          // Otherwise send value always
          filter(() =>
            this.contextService.shadowDomService.isShadowRoot
              ? this.contextService.shadowDomService.currentHost.contains(
                  this.elementRef.nativeElement
                )
              : true
          ),
          debounceTime(500),
          takeUntil(this.destroy$)
        )
        .subscribe(({ previous, current }) => {
          if (
            this.contextService.shouldRefresh(this.widget, previous, current)
          ) {
            this.refresh();
          }
        });
    }
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
    this.bindCardsScrollListener();
  }

  /**
   * Bind the scroll event listener to the summary cards container
   */
  private bindCardsScrollListener() {
    if (!this.settings.widgetDisplay?.usePagination) {
      if (this.scrollEventListener) {
        this.scrollEventListener();
      }
      this.scrollEventListener = this.renderer.listen(
        this.summaryCardGrid.nativeElement,
        'scroll',
        (event: any) => this.loadOnScroll(event)
      );
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resizeObserver.disconnect();
    if (this.scrollEventListener) {
      this.scrollEventListener();
    }
    if (this.scrollEventBindTimeout) {
      clearTimeout(this.scrollEventListener);
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
      if (value === 'cards') {
        if (this.scrollEventBindTimeout) {
          clearTimeout(this.scrollEventListener);
        }
        // On switching views, summary card element ref is destroyed
        // and all events attached to it are not working as they are bind to
        // previous element, therefor we have to set them again
        this.scrollEventBindTimeout = setTimeout(
          () => this.bindCardsScrollListener(),
          0
        );
      } else {
        // Clean previously attached scroll listener as the element ref is destroyed
        if (this.scrollEventListener) {
          this.scrollEventListener();
        }
      }
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
    if (!card) {
      return;
    }

    // Resource configuration
    if (card.resource) {
      if (this.useAggregation) {
        this.getCardsFromAggregation(card);
      } else if (this.useLayout) {
        await this.createDynamicQueryFromLayout(card);
      }
    } else if (this.useReferenceData) {
      // Using reference data
      this.refData = await this.referenceDataService.loadReferenceData(
        card.referenceData as string
      );

      if (
        this.refData?.pageInfo?.strategy &&
        !this.refData?.pageInfo?.pageSizeVar
      ) {
        // In this case we don't know the page size, so we set it to zero and then
        // we update it when we get the first page and set the total count to the number of items
        this.pageInfo.pageSize = 0;
      }
      const variables = this.queryPaginationVariables();
      from(
        this.referenceDataService.fetchItems(this.refData, {
          ...variables,
          ...(this.queryParams ?? {}),
        })
      )
        .pipe(takeUntil(merge(this.cancelRefresh$, this.destroy$)))
        .subscribe(({ items, pageInfo }) =>
          this.updateReferenceDataCards(items, pageInfo)
        );
    }
  }

  /**
   * Handles the search on cards
   *
   * @param search search value
   */
  private handleSearch(search: string) {
    this.pageInfo.pageIndex = 0;
    this.pageInfo.skip = 0;
    if (this.useAggregation) {
      // Only need to fetch data if is dynamic and not an aggregation
      const skippedFields = ['id', 'incrementalId'];
      this.sortedCachedCards = this.cachedCards.filter((card: any) => {
        const data = clone(card.record || card.rawValue || {});
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
    } else if (this.useLayout) {
      this.loading = true;
      from(
        this.dataQuery?.refetch({
          skip: 0,
          first: this.pageInfo.pageSize,
          filter: this.queryFilter,
          contextFilters: this.contextService.injectContext(
            this.contextFilters
          ),
          sortField: this.sortOptions.field,
          sortOrder: this.sortOptions.order,
          ...(this.settings.at && {
            at: this.contextService.atArgumentValue(this.settings.at),
          }),
        })
      )
        .pipe(takeUntil(merge(this.cancelRefresh$, this.destroy$)))
        .subscribe(this.updateRecordCards.bind(this));
    } else if (this.useReferenceData) {
      if (this.refData?.pageInfo?.strategy) {
        this.refresh();
      } else {
        const contextFilters = this.contextService.injectContext(
          this.contextFilters
        );
        this.sortedCachedCards = cloneDeep(
          this.cachedCards
            .filter((x) => filterReferenceData(x.rawValue, contextFilters))
            .filter((card: any) => {
              return (
                JSON.stringify(card.rawValue)
                  .replace(/("\w+":)/g, '')
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            })
        );
        this.cards = this.sortedCachedCards.slice(0, this.pageInfo.pageSize);
        this.pageInfo.length = this.sortedCachedCards.length;
      }
    }
  }

  /**
   * Updates the cards from fetched custom query
   *
   * @param data Query result
   * @param data.data Data field
   * @param data.loading Loading status
   */
  private updateRecordCards({
    data,
    loading,
  }: {
    data: any;
    loading: boolean;
  }) {
    if (!data) {
      return;
    }
    let newCards: any[] = [];

    const layoutQueryName = this.layout?.query.name;
    if (this.layout) {
      const edges = data?.[layoutQueryName].edges;
      if (!edges) {
        return;
      }

      newCards = edges.map((e: any) => ({
        ...this.settings.card,
        record: e.node,
        layout: this.layout,
        metadata: this.fields,
        style: e.meta.style,
      }));
    } else if (this.settings.card?.aggregation) {
      if (!data?.recordsAggregation?.items) return;
      newCards = data.recordsAggregation.items.map((x: any) => ({
        ...this.settings.card,
        rawValue: x,
      }));
    } else {
      return;
    }

    // update card list and scroll behavior according to the card items display

    this.cards = newCards;
    if (this.widget.settings.widgetDisplay.hideEmpty) {
      // Listen to cards data changes to know when widget is empty and will be hidden
      this.isEmpty = this.cards.length ? false : true;
      this.dashboardService.widgetContentRefreshed.next(null);
    }
    if (
      this.settings.widgetDisplay?.usePagination ||
      this.triggerRefreshCardList
    ) {
      if (this.displayMode == 'cards') {
        this.summaryCardGrid.nativeElement.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
    this.pageInfo.length = get(
      data[layoutQueryName ?? 'recordsAggregation'],
      'totalCount',
      0
    );
    this.scrolling = false;
    this.triggerRefreshCardList = false;
    this.loading = loading;
  }

  /**
   * Update the cards from fetched reference data
   *
   * @param items Reference data items
   * @param pageInfo Reference data pagination info response
   */
  private async updateReferenceDataCards(
    items: any[],
    pageInfo: Awaited<
      ReturnType<typeof this.referenceDataService.fetchItems>
    >['pageInfo']
  ) {
    if (!this.refData) {
      return;
    }

    // Fields metadata to be stored in the cards
    const metadata = (this.refData?.fields || [])
      .filter((field: any) => field && typeof field !== 'string')
      .map((field: any) => {
        return {
          label: field.name,
          name: field.name,
          type: field.type,
        };
      });

    // Does not apply to infinite scrolling
    if (this.settings.widgetDisplay?.usePagination) {
      // Add empty blocks if we go from page 2 to page 4 for example
      if (
        this.cachedCards.length <=
        this.pageInfo.pageIndex * (this.pageInfo.pageSize || pageInfo?.pageSize)
      ) {
        // Number of empty cards to add to the cached cards
        const emptyCardsToAdd =
          this.pageInfo.pageIndex *
            (this.pageInfo.pageSize || pageInfo?.pageSize) -
          this.cachedCards.length;

        // Add empty cards to the cached cards
        this.cachedCards.push(
          ...Array.from({ length: emptyCardsToAdd }, () => ({}))
        );
      }
    }
    const strategy = this.refData?.pageInfo?.strategy;
    const totalCountConfigured = this.refData?.pageInfo?.totalCountField;
    const start = strategy
      ? this.pageInfo.pageIndex * (this.pageInfo.pageSize || pageInfo?.pageSize)
      : 0;
    // Add the new items to the cached cards in the correct position
    this.cachedCards.splice(
      start,
      items.length,
      ...((items || []).map((x: any, index: number) => ({
        ...this.settings.card,
        rawValue: x,
        index,
        metadata,
      })) as CardT[])
    );

    const isPaginated = !!strategy && !!pageInfo;
    if (isPaginated) {
      // If using pagination, set the page size and total count
      // according to the response of the first page
      this.setPaginationInfo(pageInfo);
      this.sortedCachedCards = cloneDeep(this.cachedCards);
      this.checkIfFinalPage(totalCountConfigured, items);
    } else {
      // Client side filtering
      const contextFilters = this.contextService.injectContext(
        this.contextFilters
      );

      this.sortedCachedCards = cloneDeep(this.cachedCards).filter((x) =>
        filterReferenceData(x.rawValue, contextFilters)
      );

      if (this.searchControl.value) {
        this.sortedCachedCards = this.sortedCachedCards.filter((card: any) => {
          return (
            JSON.stringify(card.rawValue)
              .replace(/("\w+":)/g, '')
              .toLowerCase()
              .indexOf((this.searchControl.value as string).toLowerCase()) !==
            -1
          );
        });
      }

      // If not, all the items are already loaded
      this.pageInfo.length = this.cachedCards.length;
    }

    // Set sort fields
    this.sortFields = [];
    this.widget.settings.sortFields?.forEach((sortField: any) => {
      this.sortFields.push(sortField);
    });

    if (this.gridSettings?.referenceData) {
      Object.assign(this.gridSettings, {
        refDataCards: cloneDeep(this.cachedCards),
      });
    }

    // If using infinite scroll, just add the new items to the cards list
    if (!this.settings.widgetDisplay?.usePagination) {
      if (isPaginated) {
        this.cards = this.sortedCachedCards;
      } else {
        this.cards = this.sortedCachedCards.slice(0, this.pageInfo.pageSize);
      }
    } else {
      this.cards = this.sortedCachedCards.slice(
        this.pageInfo.skip,
        this.pageInfo.skip + this.pageInfo.pageSize
      );
    }
    if (this.widget.settings.widgetDisplay.hideEmpty) {
      // Listen to cards data changes to know when widget is empty and will be hidden
      this.isEmpty = this.cards.length ? false : true;
      this.dashboardService.widgetContentRefreshed.next(null);
    }

    if (!isPaginated) {
      this.pageInfo.length = this.sortedCachedCards.length;
    }

    this.scrolling = false;
    this.loading = false;
  }

  /**
   * Set the pagination info
   *
   * @param pageInfo Pagination info
   * @param pageInfo.totalCount Total count
   * @param pageInfo.pageSize Page size
   * @param pageInfo.lastCursor Last cursor
   */
  setPaginationInfo(pageInfo: {
    totalCount: any;
    pageSize: any;
    lastCursor: any;
  }) {
    this.pageInfo.length = this.finalPage
      ? this.pageInfo.length
      : pageInfo.totalCount;
    this.pageInfo.pageSize = this.pageInfo.pageSize || pageInfo.pageSize;
    this.pageInfo.lastCursor = pageInfo.lastCursor;
  }

  /**
   * Check if the current page is the last page
   *
   * @param totalCountConfigured Total count configured
   * @param items Items
   */
  checkIfFinalPage(
    totalCountConfigured: string | undefined,
    items: string | any[]
  ) {
    if (!totalCountConfigured && items.length < this.pageInfo.pageSize) {
      this.finalPageBehavior();
    }
  }

  /**
   * Set new new behavior
   */
  finalPageBehavior() {
    this.pageInfo.length = this.cachedCards.length;
    this.finalPage = true;
  }

  /**
   * Refetch cards from the view.
   */
  public refreshCardList() {
    this.triggerRefreshCardList = true;
    this.dataQuery.refetch();
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
    await this.gridLayoutService
      .getLayouts(card.resource, {
        ids: [card.layout],
        first: 1,
      })
      .then(async ({ edges }) => {
        const layouts = edges.map((edge) => edge.node);
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
                first: this.pageInfo.pageSize,
                filter: this.queryFilter,
                contextFilters: this.contextService.injectContext(
                  this.contextFilters
                ),
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
              .subscribe(this.updateRecordCards.bind(this));
          }
          // Build meta query to add information to fields
          this.metaQuery = this.queryBuilder.buildMetaQuery(this.layout.query);
          if (this.metaQuery) {
            this.loading = true;
            const { data } = await this.metaQuery
              .pipe(takeUntil(this.destroy$))
              .toPromise();

            const promises = Object.entries(data).map(async ([key]) => {
              if (Object.prototype.hasOwnProperty.call(data, key)) {
                this.metaFields = Object.assign({}, data[key]);
                try {
                  await this.gridService.populateMetaFields(this.metaFields);
                  this.fields = this.fields.map((field) => {
                    const metaData = this.metaFields[field.name];
                    if (metaData) {
                      field = {
                        ...field,
                        meta: metaData,
                      };
                      if (metaData.columns || metaData.row) {
                        return {
                          ...field,
                          columns: metaData.columns,
                          rows: metaData.rows,
                        };
                      }
                    }
                    return field;
                  });
                } catch (err) {
                  console.error(err);
                }
              }
            });
            await Promise.all(promises);
            // Update cards metadata (will be the fields value in the cards content)
            this.cards = this.cards.map((c: CardT) => ({
              ...c,
              metadata: this.fields,
            }));
          }
        }
      });
  }

  /**
   * Set up grid view settings from card definition
   */
  private async setupGridSettings(): Promise<void> {
    const card = this.settings.card;
    if (
      !card ||
      (!card.referenceData &&
        !card.resource &&
        (!card.layout || !card.aggregation))
    )
      return;
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
          field: get(this.settings, 'actions.navigateSettings.field', ''),
          title: get(this.settings, 'actions.navigateSettings.title', ''),
        },
      },
      contextFilters: JSON.stringify(this.contextFilters),
    };
    if (card.referenceData) {
      Object.assign(settings, { referenceData: card.referenceData });
    } else {
      Object.assign(
        settings,
        card.aggregation
          ? { aggregations: card.aggregation }
          : { layouts: card.layout }
      );
    }

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
    this.loading = true;
    this.dataQuery = this.aggregationService.aggregationDataWatchQuery(
      card.resource as string,
      card.aggregation as string,
      this.pageInfo.pageSize,
      0,
      this.contextService.injectContext(this.contextFilters),
      this.widget.settings.at
        ? this.contextService.atArgumentValue(this.widget.settings.at)
        : undefined
    );

    this.dataQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateRecordCards.bind(this));

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
    /** If scroll is reaching bottom of scrolling height, trigger card load */
    const isScrollNearBottom =
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) < 50;
    if (isScrollNearBottom) {
      if (!this.scrolling && this.pageInfo.length > this.cards.length) {
        this.cards.length;
        this.scrolling = true;
        if (this.useReferenceData) {
          if (!this.refData?.pageInfo?.strategy) {
            const start = this.cards.length;
            const end = start + this.pageInfo.pageSize;
            this.cards.push(...this.sortedCachedCards.slice(start, end));
            this.scrolling = false;
          } else {
            this.onPage({
              pageSize: this.pageInfo.pageSize,
              skip: this.pageInfo.skip + this.pageInfo.pageSize,
              previousPageIndex: this.pageInfo.pageIndex,
              pageIndex: this.pageInfo.pageIndex + 1,
              totalItems: this.pageInfo.length,
            });
          }
        } else {
          from(
            this.dataQuery?.fetchMore({
              variables: {
                skip: this.cards.length,
              },
            })
          )
            .pipe(takeUntil(merge(this.cancelRefresh$, this.destroy$)))
            .subscribe(() => this.updateRecordCards.bind(this));
        }
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
    this.pageInfo.pageIndex = event.pageIndex;

    if (this.dataQuery) {
      this.loading = true;
      const layoutQuery = this.layout?.query;
      from(
        this.dataQuery.refetch({
          first: this.pageInfo.pageSize,
          skip: event.skip,
          filter: this.queryFilter,
          contextFilters: this.contextService.injectContext(
            this.contextFilters
          ),
          sortField: this.sortOptions.field,
          sortOrder: this.sortOptions.order,
          styles: layoutQuery?.style || null,
          ...(this.settings.at && {
            at: this.contextService.atArgumentValue(this.settings.at),
          }),
        })
      )
        .pipe(takeUntil(merge(this.cancelRefresh$, this.destroy$)))
        .subscribe(this.updateRecordCards.bind(this));
    } else if (this.useReferenceData && this.refData) {
      // Only set loading state if using pagination, not infinite scroll
      this.loading = !this.scrolling;
      const variables = this.queryPaginationVariables(event.pageIndex);

      from(
        this.referenceDataService.fetchItems(this.refData, {
          ...variables,
          ...(this.queryParams ?? {}),
        })
      )
        .pipe(takeUntil(merge(this.cancelRefresh$, this.destroy$)))
        .subscribe(({ items, pageInfo }) => {
          this.updateReferenceDataCards(items, pageInfo);
          this.loading = false;
        });
    }
  }

  /**
   * Store new page size in local storage, so next time widgets are drawn, remembers it
   *
   * @param event page size change event
   */
  public onPageSizeChange(event: PageSizeChangeEvent): void {
    localStorage.setItem(SELECTED_PAGE_SIZE_KEY, event.newPageSize.toString());
  }

  /**
   * Refresh view
   */
  public refresh() {
    this.cancelRefresh$.next();
    this.cards = [];
    this.sortedCachedCards = [];
    this.cachedCards = [];
    this.finalPage = false;

    if (this.summaryCardGrid) {
      this.summaryCardGrid.nativeElement.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    this.onPage({
      pageSize: this.pageInfo.pageSize,
      skip: 0,
      previousPageIndex: 0,
      pageIndex: 0,
      totalItems: 0,
    });
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

  /**
   * Handles sorting on the cards.
   *
   * @param e Selected sort option.
   */
  public onSort(e: any) {
    this.cancelRefresh$.next();
    if (e) {
      this.sortOptions = { field: e.field, order: e.order };
    } else {
      if (this.useLayout) {
        this.sortOptions = {
          field: get(this.layout?.query, 'sort.field', null),
          order: get(this.layout?.query, 'sort.order', ''),
        };
      }
    }
    if (this.gridComponent) {
      this.gridComponent.onSort(e);
    } else {
      if (this.useLayout) {
        if (!this.dataQuery) {
          return;
        }
        from(
          this.dataQuery.refetch({
            first: this.pageInfo.pageSize,
            filter: this.queryFilter,
            contextFilters: this.contextService.injectContext(
              this.contextFilters
            ),
            sortField: this.sortOptions.field,
            sortOrder: this.sortOptions.order,
            ...(this.settings.at && {
              at: this.contextService.atArgumentValue(this.settings.at),
            }),
          })
        )
          .pipe(takeUntil(merge(this.cancelRefresh$, this.destroy$)))
          .subscribe(() => (this.loading = false));
      } else if (this.useReferenceData) {
        if (this.refData?.pageInfo?.strategy) {
          this.refresh();
        } else {
          this.loading = true;
          this.pageInfo.pageIndex = 0;
          this.pageInfo.skip = 0;
          if (e) {
            const field = `rawValue.${this.sortOptions.field as string}`;
            if (this.sortOptions.order === 'asc') {
              this.sortedCachedCards.sort((a, b) => {
                const fieldA = String(get(a, field) || '');
                const fieldB = String(get(b, field) || '');
                return fieldA.localeCompare(fieldB);
              });
            } else {
              this.sortedCachedCards.sort((a, b) => {
                const fieldA = String(get(a, field) || '');
                const fieldB = String(get(b, field) || '');
                return fieldB.localeCompare(fieldA);
              });
            }
            this.cards = this.sortedCachedCards.slice(
              0,
              this.pageInfo.pageSize
            );
          } else {
            this.sortedCachedCards.sort(
              (a, b) => (a.index as number) - (b.index as number)
            );
            this.cards = this.sortedCachedCards.slice(
              0,
              this.pageInfo.pageSize
            );
          }
          this.loading = false;
        }
      }
    }
  }

  /**
   * Replace widget variables in mapping
   *
   * @param object mapping
   * @returns updated mapping
   */
  private replaceWidgetVariables(object: any): any {
    // Replace sort options
    const sort = this.sortOptions;
    if (sort && sort.field && sort.order) {
      object = JSON.parse(
        JSON.stringify(object)
          .replace(/{{widget.sortField}}/g, sort.field)
          .replace(/{{widget.sortOrder}}/g, sort.order)
      );
    }

    // Replace search
    const search = this.searchControl.value || '';
    object = JSON.parse(
      JSON.stringify(object).replace(/{{widget.search}}/g, search)
    );
    return object;
  }

  /**
   * Build the variables for the query based on the pagination strategy
   *
   * @param pageIndex Page index number (for onPage events)
   * @returns variables object
   */
  private queryPaginationVariables(pageIndex = 0): any {
    const strategy = this.refData?.pageInfo?.strategy;
    const refData = this.refData;

    const variables: any = Object.assign(
      {},
      refData?.pageInfo?.pageSizeVar
        ? { [refData.pageInfo.pageSizeVar]: this.pageInfo.pageSize }
        : {}
    );
    // If using pagination, fetch the next page
    if (strategy && refData?.pageInfo) {
      // Set the pagination variable according to the strategy
      if (refData.pageInfo.strategy === 'offset') {
        variables[refData.pageInfo.offsetVar] = this.pageInfo.skip;
      } else if (refData.pageInfo.strategy === 'cursor') {
        // Get the cursor at the index of skip
        variables[refData.pageInfo.cursorVar] =
          this.sortedCachedCards[this.pageInfo.skip - 1]?.rawValue?.__CURSOR__;
      } else if (refData.pageInfo.strategy === 'page') {
        variables[refData.pageInfo.pageVar] = pageIndex + 1;
      }
    }

    return variables;
  }
}
