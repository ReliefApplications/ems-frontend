import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { SafeAddCardComponent } from './add-card/add-card.component';
import { SafeCardModalComponent } from './card-modal/card-modal.component';
import {
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GetResourceByIdQueryResponse,
  GET_GRID_RESOURCE_META,
  GET_GRID_RESOURCE_LAYOUTS,
} from '../../../graphql/queries';
import { DomSanitizer } from '@angular/platform-browser';
import { SummaryCardService } from '../../../services/summary-card.service';

/** Define max height of widgets */
const MAX_ROW_SPAN = 4;
/** Define max width of widgets */
const MAX_COL_SPAN = 8;

/** Define maxc height of widgets */
const DEFAULT_CARD_HEIGHT = 2;
/** Define max width of widgets */
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

  /**
   * Summary Card Settings component.
   *
   * @param fb Angular Form Builder.
   * @param dialog Material Dialog Service.
   * @param apollo Used for getting the records query.
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param summaryCardService Service used to get the cards contents.
   */
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private summaryCardService: SummaryCardService
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
      panelClass: 'preferences-dialog',
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
      height: get(value, 'height', DEFAULT_CARD_HEIGHT),
      width: get(value, 'width', DEFAULT_CARD_WIDTH),
      isAggregation: get(value, 'isAggregation', true),
      resource: get(value, 'resource', null),
      layout: [get(value, 'layout', [])],
      record: get(value, 'record', null),
      html: get(value, 'html', null),
      useLayouts: get(value, 'useLayouts', true),
      wholeCardLayouts: get(value, 'wholeCardLayouts', false),
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
      data: this.cards.at(index).value,
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
