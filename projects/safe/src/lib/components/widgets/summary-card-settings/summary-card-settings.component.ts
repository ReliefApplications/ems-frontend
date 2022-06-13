import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SafeTileDataComponent } from '../../widget-grid/floating-options/menu/tile-data/tile-data.component';
import { SafeCardSettingsComponent } from './card-settings/card-settings.component';

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

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

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
    console.log(this.tile);
    const cards: any[] = [];
    if (this.tile.settings.cards && this.tile.settings.cards.length > 1) {
      this.tile.settings.cards.map((card: any) => {
        cards.push(this.formBuilder.group(card));
      });
    }
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      cards: this.formBuilder.array(cards),
    });
    this.change.emit(this.tileForm);
    console.log(this.tileForm);
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
    (this.tileForm?.controls.cards as any).push(
      this.formBuilder.group({ title: 'New card' })
    );
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
}
