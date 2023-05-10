import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
} from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import {
  LayoutModule,
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardModule } from '../add-card/add-card.module';
import { SummaryCardItemModule } from '../../summary-card/summary-card-item/summary-card-item.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { cloneDeep } from 'lodash';
import { createCardForm } from '../summary-card-settings.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

/** Define max height of summary card */
const MAX_ROW_SPAN = 4;
/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Component for the general summary cards tab */
@Component({
  selector: 'safe-summary-card-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    LayoutModule,
    SafeButtonModule,
    MatTooltipModule,
    MatRadioModule,
    SafeIconModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    SafeAddCardModule,
    MatButtonModule,
    SummaryCardItemModule,
  ],
  templateUrl: './summary-card-general.component.html',
  styleUrls: ['./summary-card-general.component.scss'],
})
export class SummaryCardGeneralComponent implements OnInit {
  @Input() tileForm!: FormGroup;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;

  // To prevent issues where dynamic would erase all cards
  private cachedCards: any = undefined;

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
   * Component for the general summary cards tab
   *
   * @param dialog Shared dialog service
   */
  constructor(private dialog: MatDialog) {}

  /**
   * Get cards settings as Form Array
   *
   * @returns cards as Form Array
   */
  get cards(): UntypedFormArray {
    return this.tileForm?.get('cards') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);

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
          this.cards.push(createCardForm(card));
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
   * Add a new card to the cards form array.
   * Open a modal before adding it.
   */
  async addCard() {
    const { SafeAddCardComponent } = await import(
      '../add-card/add-card.component'
    );
    const dialogRef = this.dialog.open(SafeAddCardComponent, {
      data: { isDynamic: this.tileForm?.value.isDynamic },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.cards.push(createCardForm(res));
        setTimeout(() => {
          const el = document.getElementById(`card-${this.cards.length - 1}`);
          el?.scrollIntoView({ behavior: 'smooth' });
        });
      }
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
      '../card-modal/card-modal.component'
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
