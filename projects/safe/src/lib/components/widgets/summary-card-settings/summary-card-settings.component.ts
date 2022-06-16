import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SafeCardSettingsComponent } from './card-settings/card-settings.component';
import get from 'lodash/get';

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

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

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
    this.tileForm = this.fb.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      cards: this.fb.array(
        get(this.tile, 'settings.cards', []).map((x: any) => this.cardForm(x))
      ),
    });
    this.change.emit(this.tileForm);
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
   */
  addCard() {
    this.cards.push(this.cardForm());
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
   * Open Card Settings at index
   *
   * @param index index of card to open
   */
  openCardSettings(index: number) {
    const dialogRef = this.dialog.open(SafeCardSettingsComponent, {
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
}
