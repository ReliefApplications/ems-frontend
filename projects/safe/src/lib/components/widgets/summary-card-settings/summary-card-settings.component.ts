import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { get, has, clone, cloneDeep } from 'lodash';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeAddCardComponent } from './add-card/add-card.component';
import { SafeCardModalComponent } from './card-modal/card-modal.component';
import { SafeResourceGridModalComponent } from '../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetRecordByIdQueryResponse,
  GetResourceLayoutsByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_LAYOUTS,
} from './graphql/queries';
import { parseHtml } from '../summary-card/parser/utils';
import { QueryBuilderService } from '../../../services/query-builder.service';

/** Define max height of summary card */
const MAX_ROW_SPAN = 4;
/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Define default height of summary card */
const DEFAULT_CARD_HEIGHT = 2;
/** Define default width of summary card */
const DEFAULT_CARD_WIDTH = 2;

/**
 * Summary Card Settings component.
 */
@Component({
  selector: 'safe-summary-card-settings',
  templateUrl: './summary-card-settings.component.html',
  styleUrls: ['./summary-card-settings.component.scss'],
})
export class SafeSummaryCardSettingsComponent implements OnInit, AfterViewInit {
  // === REACTIVE FORM ===
  tileForm: FormGroup | undefined;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;

  // === CARDS CONTENTS ===
  cardsContent: any[] = [];

  // === RESOURCES AND LAYOUTS ===
  private cardQueries = {};

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

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
   * Get cards settings as Form Array
   *
   * @returns cards as Form Array
   */
  get cards(): FormArray {
    return this.tileForm?.get('cards') as FormArray;
  }

  private cachedCards: any = undefined;

  /**
   * Summary Card Settings component.
   *
   * @param fb Angular Form Builder.
   * @param dialog Material Dialog Service.
   * @param apollo Used for getting the records query.
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param snackBar snackbar service for error messages
   * @param translate translation service
   * @param queryBuilder query builder service
   */
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private queryBuilder: QueryBuilderService
  ) {}

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);
    this.tileForm = this.fb.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      isDynamic: get(this.tile, 'settings.isDynamic', false),
      cards: this.fb.array(
        get(this.tile, 'settings.cards', []).map((x: any) => this.cardForm(x))
      ),
    });
    this.getCardsContent(this.cards.value);
    this.cards.valueChanges.subscribe((value: any) => {
      this.getCardsContent(value);
    });

    // Prevents user from having both dynamic and static cards
    this.tileForm.get('isDynamic')?.valueChanges.subscribe(() => {
      // caches the cards of the other type
      const newCache = {
        settings: cloneDeep(this.cards.value),
        content: cloneDeep(this.cardsContent),
      };

      // removes the cards of the other type
      this.cards.clear();
      this.cardsContent = [];

      // add cards from cache
      if (this.cachedCards) {
        this.cachedCards.settings.forEach((card: any) => {
          this.cards.push(this.cardForm(card));
        });
        this.cardsContent = this.cachedCards.content;
      }

      // update cache
      this.cachedCards = newCache;
    });
    this.change.emit(this.tileForm);
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
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
  }

  /**
   * Add a new card to the cards form array.
   * Open a modal before adding it.
   */
  addCard() {
    const dialogRef = this.dialog.open(SafeAddCardComponent, {
      data: { isDynamic: this.tileForm?.value.isDynamic },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.cards.push(this.cardForm(res));
      }
    });
  }

  /**
   * Create a card form
   *
   * @param value card value, optional
   * @returns card as form group
   */
  private cardForm(value?: any): FormGroup {
    return this.fb.group({
      title: get(value, 'title', 'New Card'),
      isDynamic: value.isDynamic,
      height: [
        get(value, 'height', DEFAULT_CARD_HEIGHT),
        [Validators.min(1), Validators.max(MAX_ROW_SPAN)],
      ],
      width: [
        get(value, 'width', DEFAULT_CARD_WIDTH),
        [Validators.min(1), Validators.max(MAX_COL_SPAN)],
      ],
      isAggregation: get(value, 'isAggregation', true),
      resource: get(value, 'resource', null),
      layout: [get(value, 'layout', [])],
      record: get(value, 'record', null),
      html: get(value, 'html', null),
      showDataSourceLink: get(value, 'showDataSourceLink', false),
    });
  }

  /**
   * Remove a card from the cards form array.
   *
   * @param index index of card to remove
   */
  removeCard(index: number) {
    this.cards.removeAt(index);
  }

  /**
   * Open Card at index
   *
   * @param index index of card to open
   */
  openCard(index: number) {
    const dialogRef = this.dialog.open(SafeCardModalComponent, {
      disableClose: true,
      data: this.cards.at(index),
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'tile-settings-dialog',
    });

    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.cards.at(index).setValue(value);
      }
    });
  }

  /**
   * Emits reorder event.
   *
   * @param e reorder event.
   */
  onReorder(e: TileLayoutReorderEvent) {
    const newValue = (this.tileForm?.controls.cards as any).controls[
      e.oldIndex
    ];
    const oldValue = (this.tileForm?.controls.cards as any).controls[
      e.newIndex
    ];
    (this.tileForm?.controls.cards as any).removeAt(e.newIndex);
    (this.tileForm?.controls.cards as any).insert(e.newIndex, newValue);
    (this.tileForm?.controls.cards as any).removeAt(e.oldIndex);
    (this.tileForm?.controls.cards as any).insert(e.oldIndex, oldValue);
  }

  /**
   * Handles resize widget event.
   *
   * @param e Resize event.
   */
  public onResize(e: TileLayoutResizeEvent) {
    if (e.newRowSpan > MAX_ROW_SPAN) {
      e.newRowSpan = MAX_ROW_SPAN;
    }
    if (e.newColSpan > MAX_COL_SPAN) {
      e.newColSpan = MAX_COL_SPAN;
    }
    (this.tileForm?.controls.cards as any).controls[e.item.order].patchValue({
      height: e.newRowSpan,
      width: e.newColSpan,
    });
  }

  /**
   * Updates the card content array.
   *
   * @param cards Array of cards form value.
   */
  private getCardsContent(cards: any[]) {
    const newCardsContent: any[] = [];
    cards.map(async (card: any, i: number) => {
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
          parseHtml(card.html, newCardsContent[i].record)
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
                parseHtml(card.html, newCardsContent[i].record)
              );
              this.cardsContent = newCardsContent;
            }
          });
      } else if (card.isDynamic) {
        // Gets first record as an example for the dynamic card
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
            const builtQuery = this.queryBuilder.buildQuery({ query });

            this.apollo
              .watchQuery<any>({
                query: builtQuery,
                variables: {
                  first: 1,
                  filter: query.filter,
                  sort: query.sort,
                },
              })
              .valueChanges.subscribe((res2) => {
                if (res2?.data) {
                  newCardsContent[i].record =
                    res2.data[query.name].edges[0]?.node;
                  newCardsContent[i].html =
                    this.sanitizer.bypassSecurityTrustHtml(
                      parseHtml(card.html, newCardsContent[i].record)
                    );
                }
              });
          }
        }
        this.cardsContent = newCardsContent;
      }
    });
  }

  /**
   * Open the data source modal
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
