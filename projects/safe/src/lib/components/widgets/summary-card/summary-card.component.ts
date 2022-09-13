import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QueryBuilderService } from '../../../services/query-builder.service';
import {
  GetResourceLayoutsByIdQueryResponse,
  GET_RESOURCE_LAYOUTS,
} from './graphql/queries';

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/**
 * Summary Card Widget component.
 */
@Component({
  selector: 'safe-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SafeSummaryCardComponent implements OnInit {
  @Input() header = true;
  @Input() export = true;
  @Input() settings: any = null;

  // === GRID ===
  public colsNumber = MAX_COL_SPAN;

  // === DYNAMIC CARDS QUERY ===
  private dynamicCardQuery: {
    builtQuery: any;
    sort: any;
    filter: any;
    name: string;
  } | null = null;

  // === DYNAMIC CARDS PAGINATION ===
  public pageSize = 2;
  public hasNextPage = true;
  public loading = false;

  public cards: any[] = [];

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
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {}

  async ngOnInit() {
    if (this.settings.isDynamic) {
      await this.getDynamicCardQuery();
      this.getMoreCards();
    } else {
      this.cards = this.settings.cards;
    }
    this.colsNumber = this.setColsNumber(window.innerWidth);
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
  private async getDynamicCardQuery() {
    // only one dynamic card is allowed per widget
    const [card] = this.settings.cards;
    if (!card) return;

    const res = await this.apollo
      .query<GetResourceLayoutsByIdQueryResponse>({
        query: GET_RESOURCE_LAYOUTS,
        variables: {
          id: card.resource,
        },
      })
      .toPromise();
    const layouts = res.data?.resource?.layouts || [];
    const query = layouts.find((l: any) => l.id === card.layout)?.query;
    if (!query) return;

    this.dynamicCardQuery = {
      builtQuery: this.queryBuilder.buildQuery({ query }),
      sort: query.sort,
      filter: query.filter,
      name: query.name,
    };
  }

  /**
   * Fetches the next page of records for the dynamic card.
   */
  public async getMoreCards() {
    const query = this.dynamicCardQuery;
    if (!query?.builtQuery) return;

    this.loading = true;
    const newCardsContent: any[] = [];
    this.apollo
      .watchQuery<any>({
        query: query.builtQuery,
        variables: {
          first: this.pageSize,
          skip: this.cards.length,
          filter: query.filter,
          sort: query.sort,
        },
      })
      .valueChanges.subscribe((res2) => {
        if (res2?.data) {
          res2.data[query.name].edges.map((e: any) => {
            newCardsContent.push({
              ...this.settings.cards[0],
              record: e.node.id,
            });
          });

          this.cards = [...this.cards, ...newCardsContent];
          this.hasNextPage =
            res2.data[query.name].totalCount > this.cards.length;
        }
        this.loading = res2.loading;
      });
  }
}
