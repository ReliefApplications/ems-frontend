import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { cloneDeep, get } from 'lodash';


/** Define max height of summary card */
const MAX_ROW_SPAN = 4;
/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Define default height of summary card */
const DEFAULT_CARD_HEIGHT = 2;
/** Define max width of summary card */
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
  tileForm: UntypedFormGroup | undefined;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;

  // To prevent issues where dynamic would erase all cards
  private cachedCards: any = undefined;

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
  get cards(): UntypedFormArray {
    return this.tileForm?.get('cards') as UntypedFormArray;
  }

  /**
   * Summary Card Settings component.
   *
   * @param fb Angular Form Builder.
   * @param dialog Material Dialog Service.
   */
  constructor(private fb: UntypedFormBuilder, private dialog: MatDialog) {}

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
    this.change.emit(this.tileForm);

    // Prevents user from having both dynamic and static cards
    this.tileForm.get('isDynamic')?.valueChanges.subscribe(() => {
      // if (!this.tileForm?.value.isDynamic) {
      // }

      // caches the cards of the other type
      const newCache = cloneDeep(this.cards.value);

      // removes the cards of the other type
      this.cards.clear();

      // add cards from cache
      if (this.cachedCards) {
        this.cachedCards.forEach((card: any) => {
          this.cards.push(this.cardForm(card));
        });
      }

      // update cache
      this.cachedCards = newCache;
    });
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
  async addCard() {
    const { SafeAddCardComponent } = await import(
      './add-card/add-card.component'
    );
    const dialogRef = this.dialog.open(SafeAddCardComponent, {
      data: { isDynamic: this.tileForm?.value.isDynamic },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.cards.push(this.cardForm(res));
        setTimeout(() => {
          const el = document.getElementById(`card-${this.cards.length - 1}`);
          el?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  }

  /**
   * Create a card form
   *
   * @param value card value, optional
   * @returns card as form group
   */
  private cardForm(value?: any): UntypedFormGroup {
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
      layout: [get(value, 'layout', null)],
      aggregation: [get(value, 'aggregation', null)],
      record: get(value, 'record', null),
      html: get(value, 'html', null),
      showDataSourceLink: get(value, 'showDataSourceLink', false),
      availableFields: [get(value, 'availableFields', [])],
      useStyles: get(value, 'useStyles', true),
      wholeCardStyles: get(value, 'wholeCardStyles', false),
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
  async openCard(index: number) {
    const { SafeCardModalComponent } = await import(
      './card-modal/card-modal.component'
    );
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
}
