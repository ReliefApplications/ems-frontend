import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { get, has, clone } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeResourceGridModalComponent } from '../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetRecordByIdQueryResponse,
  GetResourceLayoutsByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_LAYOUTS,
} from './graphql/queries';
import { parseHtml } from './parser/utils';

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/** Card type */
type Card = {
  html: SafeHtml | null;
  record: any;
  settings: any;
};
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

  // === CARDS CONTENTS ===
  public cards: Card[] = [];

  // === RESOURCES AND LAYOUTS ===
  private cardQueries = {};

  // === DYNAMIC CARDS QUERY ===
  private dynamicCardQuery: {
    builtQuery: any;
    sort: any;
    filter: any;
    name: string;
  } | null = null;

  // === DYNAMIC CARDS PAGINATION ===
  public pageSize = 10;
  public hasNextPage = true;
  public loading = false;

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
   * Summary Card Widget component.
   *
   * @param apollo Used to get the necessary records for the cards content.
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param dialog The material dialog service
   * @param snackBar snackbar service for error messages
   * @param translate translation service
   * @param queryBuilder query builder service
   */
  constructor(
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private queryBuilder: QueryBuilderService
  ) {}

  async ngOnInit() {
    this.colsNumber = this.setColsNumber(window.innerWidth);
    if (this.settings.isDynamic) {
      await this.getDynamicCardQuery();
      this.getMoreCards();
    } else this.getStaticCardsContent(this.settings.cards);
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

  /**
   * Updates the card content array.
   *
   * @param cards Array of cards form value.
   */

  /**
   * Updates the card content array.
   *
   * @param cards Array of cards form value.
   */
  private getStaticCardsContent(cards: any[]) {
    const newCardsContent: Card[] = [];

    cards.map((card: any, i: number) => {
      newCardsContent.push({
        html: card.html
          ? this.sanitizer.bypassSecurityTrustHtml(card.html)
          : null,
        record: null,
        settings: card,
      });
      if (
        this.cards[i] &&
        this.cards[i].record &&
        this.cards[i].record.id === card.record
      ) {
        newCardsContent[i] = this.cards[i];
        newCardsContent[i].html = this.sanitizer.bypassSecurityTrustHtml(
          parseHtml(card.html, newCardsContent[i].record)
        );
        this.cards = newCardsContent;
      } else if (card.record) {
        this.apollo
          .watchQuery<GetRecordByIdQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id: card.record,
            },
          })
          .valueChanges.subscribe((res) => {
            if (res) {
              newCardsContent[i].record = res.data.record;
              newCardsContent[i].html = this.sanitizer.bypassSecurityTrustHtml(
                parseHtml(card.html, newCardsContent[i].record)
              );
              this.cards = newCardsContent;
            }
          });
      }
    });
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
    const query = layouts.find((l) => l.id === card.layout)?.query;
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
    const newCardsContent: Card[] = [];
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
            const rec = e.node;
            newCardsContent.push({
              html: this.sanitizer.bypassSecurityTrustHtml(
                parseHtml(this.settings.cards[0].html, rec)
              ),
              record: rec,
              settings: this.settings.cards[0],
            });
          });

          this.cards = [...this.cards, ...newCardsContent];
          this.hasNextPage =
            res2.data[query.name].totalCount > this.cards.length;
        }
        this.loading = res2.loading;
      });
  }

  /**
   * Open the dataSource modal
   *
   * @param card The card to open
   */
  public async openDataSource(card: any) {
    // the key of the layout used to save it, to not load it each time
    const key = `${card.resource}-${card.layout}`;
    // load and save the query of the layout if not already saved
    if (!has(this.cardQueries, key)) {
      const res = await this.apollo
        .query<GetResourceLayoutsByIdQueryResponse>({
          query: GET_RESOURCE_LAYOUTS,
          variables: {
            id: card.resource,
          },
        })
        .toPromise();
      if (!res.errors) {
        const layouts = res.data?.resource?.layouts || [];
        const query = layouts.find((l) => l.id === card.layout)?.query;
        if (query) {
          Object.assign(this.cardQueries, { [key]: query });
        }
      }
    }
    const cardQuery = get(this.cardQueries, key, null);
    if (cardQuery) {
      this.dialog.open(SafeResourceGridModalComponent, {
        data: {
          gridSettings: clone(cardQuery),
        },
        panelClass: 'closable-dialog',
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
