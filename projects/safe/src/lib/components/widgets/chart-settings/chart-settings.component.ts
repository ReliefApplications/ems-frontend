import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { Chart } from './charts/chart';
import { CHART_TYPES, LEGEND_ORIENTATIONS, LEGEND_POSITIONS, TITLE_POSITIONS } from './constants';

@Component({
  selector: 'safe-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss']
})
/*  Modal content for the settings of the chart widgets.
*/
export class SafeChartSettingsComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = CHART_TYPES;
  public legendPositions = LEGEND_POSITIONS;
  public legendOrientations = LEGEND_ORIENTATIONS;
  public titlePositions = TITLE_POSITIONS;
  public chart?: Chart;
  public type: any;

  // === DISPLAY PREVIEW ===
  private pipeline?: string;
  public pipelineChanged = false;
  public settings: any;


  public get chartForm(): FormGroup {
    return this.tileForm?.controls.chart as FormGroup || null;
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    const chartSettings = tileSettings.chart;
    if (chartSettings.type) {
      this.type = this.types.find(x => x.name === chartSettings.type);
      const chartClass = this.types.find(x => x.name === chartSettings.type);
      if (chartClass) {
        this.chart = new (chartClass.class)(chartSettings);
      }
    } else {
      this.type = null;
      this.chart = new Chart(tileSettings);
    }
    this.tileForm = this.formBuilder.group(
      {
        id: this.tile.id,
        title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
        chart: this.chart?.form
      }
    );
    this.change.emit(this.tileForm);

    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    const chartForm = this.tileForm?.get('chart') as FormGroup;
    chartForm.controls.type.valueChanges.subscribe((value) => {
      this.type = this.types.find(x => x.name === value);
    });

    this.pipeline = chartSettings.pipeline;
    this.settings = this.tileForm?.value;
    chartForm.controls.pipeline.valueChanges.subscribe((value) => {
      this.pipelineChanged = value !== this.pipeline;
    });
    chartForm.valueChanges.subscribe((value) => {
      this.settings = { chart: { ...value, ...{ pipeline: this.pipeline } } };
    });
  }

  public refreshPipeline(): void {
    this.pipeline = this.tileForm?.get('chart.pipeline')?.value;
    this.settings = this.tileForm?.value;
    this.pipelineChanged = false;
  }
}
