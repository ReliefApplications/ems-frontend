import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  LEGEND_POSITIONS,
  LEGEND_ORIENTATIONS,
  TITLE_POSITIONS,
} from '../constants';

/**
 * Display tab of the chart settings modal.
 */
@Component({
  selector: 'safe-tab-display',
  templateUrl: './tab-display.component.html',
  styleUrls: ['./tab-display.component.scss'],
})
export class TabDisplayComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() type: any;

  public legendPositions = LEGEND_POSITIONS;
  public legendOrientations = LEGEND_ORIENTATIONS;
  public titlePositions = TITLE_POSITIONS;
  public sizes = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26,
    28,
  ];

  /** @returns the form for the chart */
  public get chartForm(): FormGroup {
    return this.formGroup.get('chart') as FormGroup;
  }

  ngOnInit(): void {
    const sizeControl = this.chartForm.get('title.size');
    sizeControl?.setValue(sizeControl.value);
    sizeControl?.valueChanges.subscribe(() => this.onToggleStyle(''));
  }

  /**
   * Toggles boolean controls for title style and update font.
   *
   * @param controlName name of form control.
   */
  onToggleStyle(controlName: string): void {
    const control = this.chartForm.get(controlName);
    control?.setValue(!control.value);

    let font = '';
    if (this.chartForm.get('title.bold')?.value) {
      font = font + 'bold ';
    }
    if (this.chartForm.get('title.italic')?.value) {
      font = font + 'italic ';
    }
    font = font + this.chartForm.get('title.size')?.value.toString();
    font = font + 'pt sans-serif';
    if (this.chartForm.get('title.underline')?.value) {
      font = font + '; text-decoration: underline;';
    }

    const font_control = this.chartForm.get('title.font');
    font_control?.setValue(font);
  }
}
