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
import { firstValueFrom } from 'rxjs';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import { SafeGridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import {
  GetResourceMetadataQueryResponse,
  GET_RESOURCE_METADATA,
} from './graphql/queries';
import { SummaryCardFormT } from '../summary-card-settings/summary-card-settings.component';
import { Record } from '../../../models/record.model';
import { Layout } from '../../../models/layout.model';

export type CardT = NonNullable<SummaryCardFormT['value']['card']> &
  Partial<{
    record: Record;
    metadata: any[];
    layout: Layout;
    cardAggregationData: any;
  }>;

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
  @Input() widget: any;
  @Input() header = true;
  @Input() export = true;
  @Input() settings!: SummaryCardFormT['value'];

  public gridSettings: any = null;

  public displayMode: 'cards' | 'grid' = 'cards';
  // === GRID ===
  public colsNumber = MAX_COL_SPAN;

  // === DYNAMIC CARDS PAGINATION ===
  private pageInfo = {
    first: DEFAULT_PAGE_SIZE,
    skip: 0,
    hasNextPage: false,
  };
  public loading = true;

  public cards: CardT[] = [];
  private dataQuery?: QueryRef<any>;

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
   * @param aggregationService Aggregation service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService
  ) {}

  ngOnInit(): void {
    this.setupDynamicCards();

    this.colsNumber = this.setColsNumber(window.innerWidth);
    this.setupGridSettings();
  }

  ngAfterViewInit(): void {
    if (!this.settings.card?.aggregation) {
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
    const card = this.settings.card;
    if (!card) return;

    if (card.aggregation) this.getCardsFromAggregation(card);
    else if (card.layout) this.createDynamicQueryFromLayout(card);
  }

  /**
   * Gets the query for fetching the dynamic cards records from a card's settings
   *
   * @param card Card settings
   */
  private async createDynamicQueryFromLayout(card: any) {
    console.log('HIII', card);
    // gets metadata
    const metaRes = await firstValueFrom(
      this.apollo.query<GetResourceMetadataQueryResponse>({
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
          const layoutQuery = layouts[0].query;
          const builtQuery = this.queryBuilder.buildQuery({
            query: layoutQuery,
          });
          const layoutFields = layoutQuery.fields;
          const fields = get(metaRes, 'data.resource.metadata', []).map(
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

          if (builtQuery) {
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
              const edges = res2.data?.[layoutQuery.name].edges;
              if (!edges) return;

              const newCards = edges.map((e: any) => ({
                ...this.settings.card,
                record: e.node,
                layout: layouts[0],
                metadata: fields,
              }));

              this.cards = [...this.cards, ...newCards];
              this.pageInfo.hasNextPage =
                get(res2.data[layoutQuery.name], 'totalCount', 0) >
                this.cards.length;

              this.loading = res2.loading;
            });
          }
        }
      });
  }

  /**
   * mdr
   */
  private async setupGridSettings() {
    const card = this.settings.card;
    if (!card || !card.resource || !card.layout) return;

    this.gridLayoutService
      .getLayouts(card.resource, { ids: [card.layout], first: 1 })
      .then((res) => {
        const layouts = res.edges.map((edge) => edge.node);
        if (layouts.length > 0) {
          const layout = layouts[0] || null;
          this.gridSettings = {
            ...{ template: get(this.settings, 'template', null) }, //TO MODIFY
            ...{ resource: card.resource },
            ...{ layouts: layout.id },
            ...{
              actions: {
                //default actions, might need to modify later
                addRecord: false,
                convert: true,
                delete: true,
                export: true,
                history: true,
                inlineEdition: true,
                showDetails: true,
                update: true,
              },
            },
          };
        }
      });
    return;
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
    this.aggregationService
      .aggregationDataQuery(card.resource, card.aggregation)
      ?.subscribe((res) => {
        if (!res.data?.recordsAggregation?.items) return;
        this.cards = res.data.recordsAggregation.items.map((x: any) => ({
          ...this.settings.card,
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
        // TOCHECK
        this.dataQuery?.fetchMore({
          variables: {
            skip: this.cards.length,
          },
        });
      }
    }
  }
}
