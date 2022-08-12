import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { get, has, clone } from 'lodash';
import { SafeResourceGridModalComponent } from '../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetRecordByIdQueryResponse,
  GetResourceLayoutsByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_LAYOUTS,
} from './graphql/queries';

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
   * Summary Card Widget component.
   *
   * @param apollo Used to get the necessary records for the cards content.
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param dialog The material dialog service
   */
  constructor(
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.settings);
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
      if (
        this.cardsContent[i] &&
        this.cardsContent[i].record &&
        this.cardsContent[i].record.id === card.record
      ) {
        newCardsContent[i] = this.cardsContent[i];
        newCardsContent[i].html = this.sanitizer.bypassSecurityTrustHtml(
          this.replaceRecordFields(card.html, newCardsContent[i].record)
        );
        this.cardsContent = newCardsContent;
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
                this.replaceRecordFields(card.html, newCardsContent[i].record)
              );
              this.cardsContent = newCardsContent;
            }
          });
      }
    });
  }

  /**
   * Replaces the html resource fields with the resource data.
   *
   * @param html String with the content html.
   * @param record Record object.
   * @returns Returns the card content with the resource data.
   */
  private replaceRecordFields(html: string, record: any): string {
    const fields = this.getFieldsValue(record);
    let formatedHtml = html;
    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        const regex = new RegExp(`@\\bdata.${key}\\b`, 'gi');
        formatedHtml = formatedHtml.replace(regex, value as string);
      }
    }
    return formatedHtml;
  }

  /**
   * Returns an object with the record data keys paired with the values.
   *
   * @param record Record object.
   * @returns Returns fields value.
   */
  private getFieldsValue(record: any): any {
    const fields: any = {};
    for (const [key, value] of Object.entries(record)) {
      if (!key.startsWith('__') && key !== 'form') {
        if (value instanceof Object) {
          for (const [key2, value2] of Object.entries(value)) {
            if (!key2.startsWith('__')) {
              fields[(key === 'data' ? '' : key + '.') + key2] = value2;
            }
          }
        } else {
          fields[key] = value;
        }
      }
    }
    return fields;
  }

  /**
   * Open the datasource modal
   *
   * @param card The card to open
   */
  public async openDatasource(card: any) {
    const id = `${card.resource}-${card.layout}`;
    if (!has(this.cardQueries, id)) {
      // load and save the query object if not already saved
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
        Object.assign(this.cardQueries, {
          [id]: layouts.find((l) => l.id === card.layout)?.query,
        });
      }
    }
    const query = get(this.cardQueries, id);
    this.dialog.open(SafeResourceGridModalComponent, {
      data: {
        gridSettings: clone(query),
      },
    });
  }
}
