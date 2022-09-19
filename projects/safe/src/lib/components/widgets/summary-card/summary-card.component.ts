import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { SafeGridLayoutService } from '../../../services/grid-layout.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/** Default page size for pagination */
const DEFAULT_PAGE_SIZE = 25;

/**
 * Summary Card Widget component.
 */
@Component({
  selector: 'safe-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SafeSummaryCardComponent implements OnInit, AfterViewInit {
  @Input() header = true;
  @Input() export = true;
  @Input() settings: any = null;

  // === GRID ===
  public colsNumber = MAX_COL_SPAN;

  // === DYNAMIC CARDS PAGINATION ===
  private pageInfo = {
    first: DEFAULT_PAGE_SIZE,
    skip: 0,
    hasNextPage: false,
  };
  public loading = true;

  public cards: any[] = [];

  private dataQuery?: QueryRef<any>;

  /**
   * Gets whether the cards that will be displayed
   * are from an aggregation
   *
   * @returns if the cards are from an aggregation
   */
  private get isAggregation(): boolean {
    return !!this.settings.cards[0]?.isAggregation;
  }

  @ViewChild('pdf') pdfExport!: any;

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
   * Changes display when windows size changes.
   *
   * @param event window resize event
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.colsNumber = this.setColsNumber(event.target.innerWidth);
  }

  /**
   * Constructor for summary card component
   *
   * @param apollo Apollo service
   * @param queryBuilder Query builder service
   * @param gridLayoutService Shared grid layout service
   * @param aggregationBuilder Aggregation builder service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  ngOnInit(): void {
    if (this.settings.isDynamic) {
      this.setupDynamicCards();
    } else {
      this.cards = this.settings.cards;
    }
    this.colsNumber = this.setColsNumber(window.innerWidth);
  }

  ngAfterViewInit(): void {
    if (this.settings.isDynamic && !this.isAggregation) {
      this.pdfExport.element.nativeElement.addEventListener(
        'scroll',
        (event: any) => this.loadOnScroll(event)
      );
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
    const [card] = this.settings.cards;
    if (!card) return;

    if (card.isAggregation) this.getCardsFromAggregation(card);
    else this.createDynamicQueryFromLayout(card);
  }

  /**
   * Gets the query for fetching the dynamic cards records from a card's settings
   *
   * @param card Card settings
   */
  private async createDynamicQueryFromLayout(card: any) {
    this.gridLayoutService
      .getLayouts(card.resource, { ids: [card.layout], first: 1 })
      .then((res) => {
        const layouts = res.edges.map((edge) => edge.node);
        if (layouts.length > 0) {
          const layoutQuery = layouts[0].query;
          const builtQuery = this.queryBuilder.buildQuery({
            query: layoutQuery,
          });
          this.dataQuery = this.apollo.watchQuery<any>({
            query: builtQuery,
            variables: {
              first: this.pageInfo.first,
              filter: layoutQuery.filter,
              sortField: get(layoutQuery, 'sort.field', null),
              sortOrder: get(layoutQuery, 'sort.order', ''),
            },
            fetchPolicy: 'network-only',
            nextFetchPolicy: 'cache-first',
          });
          this.dataQuery.valueChanges.subscribe((res2) => {
            for (const field in res2.data) {
              if (Object.prototype.hasOwnProperty.call(res2.data, field)) {
                const newCards = res2.data[field].edges.map((e: any) => ({
                  ...this.settings.cards[0],
                  record: e.node.id,
                }));
                this.cards = [...this.cards, ...newCards];
                this.pageInfo.hasNextPage =
                  get(res2.data[field], 'totalCount', 0) > this.cards.length;
              }
            }
            this.loading = res2.loading;
          });
        }
      });
  }

  /**
   * Gets the query for fetching the dynamic cards records from a card's settings
   *
   * @param card Card settings
   */
  private async getCardsFromAggregation(card: any) {
    this.aggregationBuilder
      .buildAggregation(card.resource, card.aggregation)
      ?.subscribe((res) => {
        if (!res.data) return;
        this.cards = res.data.recordsAggregation.map((x: any) => ({
          ...this.settings.cards[0],
          cardAggregationData: x,
        }));
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
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.dataQuery?.fetchMore({
          variables: {
            ...this.dataQuery.variables,
            skip: this.cards.length,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              this.loading = false;
              return prev;
            }
            for (const field in fetchMoreResult) {
              if (
                Object.prototype.hasOwnProperty.call(fetchMoreResult, field)
              ) {
                this.loading = false;
                return Object.assign({}, prev, {
                  [field]: {
                    edges: fetchMoreResult[field].edges,
                    totalCount: fetchMoreResult[field].totalCount,
                  },
                });
              }
            }
          },
        });
      }
    }
  }
}
