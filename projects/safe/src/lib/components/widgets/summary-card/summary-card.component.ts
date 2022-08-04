import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import {
  GetRecordByIdQueryResponse,
  GetResourceByIdQueryResponse,
  GET_GRID_RESOURCE_LAYOUTS,
  GET_RECORD_BY_ID,
} from '../../../graphql/queries';
import { SummaryCardService } from '../../../services/summary-card.service';

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
  colsNumber = 8;

  // === CARDS CONTENTS ===
  cardsContent: any[] = [];

  /**
   * Gets a name for the exported pdf
   *
   * @returns Returns the name as a string
   */
  exportName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${
      this.settings.title ? this.settings.title : 'Summary Card'
    } ${formatDate}`;
  }

  /**
   * Summary Card Widget component.
   *
   * @param apollo Used to get the necessary records for the cards content.
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param summaryCardService Service used to get the cards contents.
   */
  constructor(
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private summaryCardService: SummaryCardService
  ) {}

  ngOnInit(): void {
    this.getCardsContent(this.settings.cards);
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
  private getCardsContent(cards: any[]) {
    const newCardsContent: any[] = [];

    cards.map((card: any, i: number) => {
      newCardsContent.push({
        html: card.html
          ? this.sanitizer.bypassSecurityTrustHtml(card.html)
          : null,
        record: null,
      });
      if (card.useLayouts && card.layout.length > 0) {
        this.apollo
          .query<GetResourceByIdQueryResponse>({
            query: GET_GRID_RESOURCE_LAYOUTS,
            variables: {
              resource: card.resource.resource.id,
            },
          })
          .subscribe((res) => {
            if (res.data.resource) {
              const layout = this.findLayout(
                res.data.resource.layouts,
                card.layout[0]
              ).query.style;
              this.getCardContent(newCardsContent[i], card, i, layout);
            } else {
              this.getCardContent(newCardsContent[i], card, i);
            }
          });
      } else {
        this.getCardContent(newCardsContent[i], card, i);
      }
    });
    this.cardsContent = newCardsContent;
  }

  /**
   * Updates the card provided with layout styles and record values.
   *
   * @param cardToEdit Card that will be updated.
   * @param card Card settings.
   * @param i Position of the card.
   * @param layout Optional layout style parameter.
   */
  private getCardContent(
    cardToEdit: any,
    card: any,
    i: number,
    layout: any[] = []
  ) {
    if (
      this.cardsContent[i] &&
      this.cardsContent[i].record &&
      this.cardsContent[i].record.id === card.record
    ) {
      cardToEdit = this.cardsContent[i];
      cardToEdit.html = this.sanitizer.bypassSecurityTrustHtml(
        this.summaryCardService.replaceRecordFields(
          card.html,
          cardToEdit.record,
          layout,
          card.wholeCardLayouts
        )
      );
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
            cardToEdit.record = res.data.record;
            cardToEdit.html = this.sanitizer.bypassSecurityTrustHtml(
              this.summaryCardService.replaceRecordFields(
                card.html,
                cardToEdit.record,
                layout,
                card.wholeCardLayouts
              )
            );
          }
        });
    }
  }

  /**
   * Search the an specific layout in an array.
   *
   * @param layouts Array of layout objects.
   * @param layoutToFind String with the layout id to find.
   * @returns Returns the layout if found, if not null is returned.
   */
  private findLayout(layouts: any, layoutToFind: string): any {
    let result = null;
    layouts.map((layout: any) => {
      if (layout.id === layoutToFind) {
        result = layout;
      }
    });
    return result;
  }
}
