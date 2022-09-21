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

  /** @returns the form for the chart */
  public get chartForm(): FormGroup {
    return this.formGroup.get('chart') as FormGroup;
  }

  ngOnInit(): void {}

  /**
   * Toggles boolean controls for title style and update font.
   *
   * @param controlName name of form control.
   */
  onToggleStyle(controlName: string): void {
    const control = this.chartForm.get(controlName);
    control?.setValue(!control.value);

    let new_font = '';
    if (this.chartForm.get('title.bold')?.value) {
      new_font = new_font + 'bold ';
    }
    if (this.chartForm.get('title.italic')?.value) {
      new_font = new_font + 'italic ';
    }
    new_font = new_font + '24pt sans-serif';
    if (this.chartForm.get('title.underline')?.value) {
      new_font = new_font + '; text-decoration: underline;';
    }

    console.log(new_font);

    const font_control = this.chartForm.get('title.font');
    font_control?.setValue(new_font);
  }
}
