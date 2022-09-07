import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { get, has, clone, reduce } from 'lodash';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeResourceGridModalComponent } from '../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetRecordByIdQueryResponse,
  GetResourceLayoutsByIdQueryResponse,
  GetResourceRecordsQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_LAYOUTS,
  GET_RESOURCE_RECORDS,
} from './graphql/queries';
import { parseHtml } from './parser/utils';

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

  // === CARDS CONTENTS ===
  public cards: any[] = [];

  // === RESOURCES AND LAYOUTS ===
  private cardQueries = {};

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
   */
  constructor(
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.colsNumber = this.setColsNumber(window.innerWidth);
    const populatedCards = await this.populateDynamicCards();
    this.getCards(populatedCards);
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
  private getCards(cards: any[]) {
    const newcards: any[] = [];

    cards.map((card: any, i: number) => {
      const isDynamic = card.settings.isDynamic;
      const newCard = {
        html: isDynamic
          ? card.html
          : card.settings.html
          ? this.sanitizer.bypassSecurityTrustHtml(card.settings.html)
          : null,
        record: isDynamic ? card.record : null,
        settings: card.settings,
      };
      newcards.push(newCard);
      if (
        this.cards[i] &&
        this.cards[i].record &&
        this.cards[i].record.id === card.settings.record
      ) {
        newcards[i] = this.cards[i];
        newcards[i].html = this.sanitizer.bypassSecurityTrustHtml(
          parseHtml(card.settings.html, newcards[i].record)
        );
      } else if (card.settings.record && !card.settings.isDynamic) {
        this.apollo
          .watchQuery<GetRecordByIdQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id: card.settings.record,
            },
          })
          .valueChanges.subscribe((res) => {
            if (res) {
              newcards[i].record = res.data.record;
              newcards[i].html = this.sanitizer.bypassSecurityTrustHtml(
                parseHtml(card.settings.html, newcards[i].record)
              );
            }
          });
      }

      this.cards = newcards;
    });
  }

  /**
   * Loops through the cards, when finds a dynamic card
   * fetches the records and creates a card for each one.
   * @todo refactor this function to use selected layout
   */
  private async populateDynamicCards() {
    const populatedCards: any[] = [];
    for (const card of this.settings.cards) {
      if (!card.isDynamic) {
        populatedCards.push({
          html: null,
          record: null,
          settings: card,
        });
      } else {
        const res = await this.getRecords(card);
        if (res.data) {
          const records = res.data.resource.records.edges.map((e) => e.node);
          for (const record of records) {
            populatedCards.push({
              settings: { ...card },
              html: this.sanitizer.bypassSecurityTrustHtml(
                parseHtml(card.html, record)
              ),
              record,
            });
          }
        }
        // for (const record of records) {
        //   populatedCards.push({
        //     html: this.sanitizer.bypassSecurityTrustHtml(
        //       parseHtml(card.html, record)
        //     ),
        //     record,
        //   });
        // }
      }
    }
    return populatedCards;
  }

  /**
   * Fetches the records for a dynamic card.
   *
   * @param card The card setting to get resource id from
   * @returns Promise for the resource records
   */
  private async getRecords(card: any) {
    return this.apollo
      .query<GetResourceRecordsQueryResponse>({
        query: GET_RESOURCE_RECORDS,
        variables: {
          id: card.resource,
          first: 10,
        },
      })
      .toPromise();
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
