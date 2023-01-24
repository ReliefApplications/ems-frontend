import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import get from 'lodash/get';
import { scrollFactory } from '../../../utils/scroll-factory';
import { codesFactory } from '../../distribution-lists/components/edit-distribution-list-modal/edit-distribution-list-modal.component';
import { TabSettingsOptionConfig } from '../../ui/tab-settings-options/tab-settings-options.interface';
import { Chart } from './charts/chart';
import { CHART_TYPES } from './constants';
import { ChartSettingsTabTypes } from './enums/tab-types';

/**
 * Chart settings component
 */
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
  public formGroup!: FormGroup;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = CHART_TYPES;
  public chart?: Chart;
  public type: any;
  /**Config object to load the tabs in chart settings modal */
  public tabSettingsConfig: TabSettingsOptionConfig<ChartSettingsTabTypes>[] = [
    {
      tab: ChartSettingsTabTypes.MAIN,
      icon: 'settings',
      iconSize: 24,
      translation: 'common.general',
      tooltipPosition: 'right',
    },
    {
      tab: ChartSettingsTabTypes.DISPLAY,
      icon: 'tune',
      iconSize: 24,
      translation: 'common.display',
      tooltipPosition: 'right',
    },
    {
      tab: ChartSettingsTabTypes.PREVIEW,
      icon: 'preview',
      iconSize: 24,
      translation: 'common.preview',
      tooltipPosition: 'right',
    },
  ];

  // === DISPLAY PREVIEW ===
  public settings: any;
  public grid: any;

  /** @returns the form for the chart */
  public get chartForm(): FormGroup {
    return (this.formGroup?.controls.chart as FormGroup) || null;
  }

  /** Stores the selected tab */
  public selectedTab!: ChartSettingsTabTypes;
  /** Chart tab types to use in the components html template */
  public chartSettingsTabTypes = ChartSettingsTabTypes;

  /**
   * Constructor for the chart settings component
   *
   * @param formBuilder The formBuilder service
   */
  constructor(private formBuilder: FormBuilder) {}

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
    this.formGroup = this.formBuilder.group({
      id: this.tile.id,
      title: [get(tileSettings, 'title', ''), Validators.required],
      chart: this.chart?.form,
      resource: [get(tileSettings, 'resource', null), Validators.required],
      // aggregation: [null, Validators.required],
    });
    this.change.emit(this.formGroup);

    this.formGroup?.valueChanges.subscribe(() => {
      this.change.emit(this.formGroup);
    });

    this.chartForm.controls.type.valueChanges.subscribe((value) => {
      this.type = this.types.find((x) => x.name === value);
      // this.reload.next(true);
    });
  }

  /**
   *  Handles the tab change event
   *
   * @param event Event triggered on tab switch
   */
  handleTabChange(event: ChartSettingsTabTypes): void {
    this.selectedTab = event;
  }
}
