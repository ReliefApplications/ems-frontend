import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { SafeCardCreationModalComponent } from './card-creation-modal/card-creation-modal.component';
import { SafeCardSettingsComponent } from './card-settings/card-settings.component';

/** Define max height of widgets */
const MAX_ROW_SPAN = 4;
/** Define max width of widgets */
const MAX_COL_SPAN = 8;

/** Define maxc height of widgets */
const DEFAULT_CARD_HEIGHT = 2;
/** Define max width of widgets */
const DEFAULT_CARD_WIDTH = 2;

/**
 *
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
   * Modal content for the settings of the editor widgets.
   *
   * @param formBuilder Angular Form Builder
   * @param dialog
   */
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);
    const cards: any[] = [];
    if (this.tile.settings.cards && this.tile.settings.cards.length > 0) {
      this.tile.settings.cards.map((card: any) => {
        cards.push(this.formBuilder.group(card));
      });
    }
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      isDynamic: this.tile.settings.isDynamic
        ? this.tile.settings.isDynamic
        : false,
      cards: this.formBuilder.array(cards),
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
   *
   */
  addCard() {
    const dialogRef = this.dialog.open(SafeCardCreationModalComponent, {
      panelClass: 'preferences-dialog',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        (this.tileForm?.controls.cards as any).push(
          this.formBuilder.group({
            title: 'New card',
            isDynamic: res.isDynamic,
            height: DEFAULT_CARD_HEIGHT,
            width: DEFAULT_CARD_WIDTH,
          })
        );
      }
    });
  }

  /**
   * @param i
   */
  removeCard(i: number) {
    (this.tileForm?.controls.cards as any).removeAt(i);
  }

  /**
   * @param i
   */
  openCardSettings(i: number) {
    const dialogRef = this.dialog.open(SafeCardSettingsComponent, {
      disableClose: true,
      data: this.tileForm?.value.cards[i],
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'tile-settings-dialog',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        (this.tileForm?.controls.cards as any).controls[i].setValue(res);
        console.log(res);
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
