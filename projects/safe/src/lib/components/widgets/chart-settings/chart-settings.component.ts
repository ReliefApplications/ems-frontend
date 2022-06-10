import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { scrollFactory } from '../../../utils/scroll-factory';
import { codesFactory } from '../grid-settings/floating-button-settings/floating-button-settings.component';
import { Chart } from './charts/chart';
import {
  CHART_TYPES,
  LEGEND_ORIENTATIONS,
  LEGEND_POSITIONS,
  TITLE_POSITIONS,
} from './constants';

@Component({
  selector: 'safe-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    { provide: MAT_CHIPS_DEFAULT_OPTIONS, useFactory: codesFactory },
  ],
})
/** Modal content for the settings of the chart widgets. */
export class SafeChartSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  tileForm: FormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = CHART_TYPES;
  public legendPositions = LEGEND_POSITIONS;
  public legendOrientations = LEGEND_ORIENTATIONS;
  public titlePositions = TITLE_POSITIONS;
  public chart?: Chart;
  public type: any;

  // === DISPLAY PREVIEW ===
  public settings: any;
  public grid: any;

  private reload = new BehaviorSubject<boolean>(false);
  public reload$ = this.reload.asObservable();

  public get chartForm(): FormGroup {
    return (this.tileForm?.controls.chart as FormGroup) || null;
  }

  public get aggregationForm(): FormGroup {
    return (
      ((this.tileForm?.controls.chart as FormGroup).controls
        .aggregation as FormGroup) || null
    );
  }

  constructor(
    private formBuilder: FormBuilder,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    const chartSettings = tileSettings.chart;
    if (chartSettings.type) {
      this.type = this.types.find((x) => x.name === chartSettings.type);
      const chartClass = this.types.find((x) => x.name === chartSettings.type);
      if (chartClass) {
        this.chart = new chartClass.class(chartSettings);
      }
    } else {
      this.type = null;
      this.chart = new Chart(tileSettings);
    }
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [
        tileSettings && tileSettings.title ? tileSettings.title : '',
        Validators.required,
      ],
      chart: this.chart?.form,
    });
    this.change.emit(this.tileForm);

    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    this.chartForm.controls.type.valueChanges.subscribe((value) => {
      this.type = this.types.find((x) => x.name === value);
      this.reload.next(true);
    });

    this.settings = this.tileForm?.value;
    this.aggregationForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.settings = this.tileForm?.value;
      });

    this.aggregationBuilder.getPreviewGrid().subscribe((value) => {
      this.grid = value;
    });
  }
}
