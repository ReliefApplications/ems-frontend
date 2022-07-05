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
import get from 'lodash/get';
import { createAggregationForm } from '../../ui/aggregation-builder/aggregation-builder-forms';
import { SafeAddCardComponent } from './add-card/add-card.component';
import { SafeCardModalComponent } from './card-modal/card-modal.component';

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
   * @param fb Angular Form Builder
   * @param dialog Material Dialog Service
   */
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

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
      height: DEFAULT_CARD_HEIGHT,
      width: DEFAULT_CARD_WIDTH,
      columns: get(value, 'columns', 1),
      rows: get(value, 'rows', 1),
      isAggregation: get(value, 'isAggregation', true),
      dataset: get(value, 'dataset', null),
      layout: [get(value, 'layout', [])],
      record: get(value, 'record', null),
      text: get(value, 'text', null)
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
   * @param e resize event.
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
