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

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return this.formGroup.get('chart.aggregation') as FormGroup;
  }

  ngOnInit(): void {}
}
