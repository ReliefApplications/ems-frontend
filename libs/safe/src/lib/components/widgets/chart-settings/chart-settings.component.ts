import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_AUTOCOMPLETE_SCROLL_STRATEGY as MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/legacy-autocomplete';
import { scrollFactory } from '../../../utils/scroll-factory';
import { createChartWidgetForm } from './chart-forms';
import { CHART_TYPES } from './constants';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';

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
  ],
})
/** Modal content for the settings of the chart widgets. */
export class SafeChartSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  public formGroup!: UntypedFormGroup;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = CHART_TYPES;
  public type: any;

  // === DISPLAY PREVIEW ===
  public settings: any;
  public grid: any;

  /** @returns the form for the chart */
  public get chartForm(): UntypedFormGroup {
    return (this.formGroup?.controls.chart as UntypedFormGroup) || null;
  }

  /** Stores the selected tab */
  public selectedTab = 0;

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.formGroup = extendWidgetForm(
      createChartWidgetForm(this.tile.id, this.tile.settings),
      this.tile.settings?.widgetDisplay
    );
    this.type = this.types.find((x) => x.name === this.chartForm.value.type);
    this.change.emit(this.formGroup);

    this.formGroup?.valueChanges.subscribe(() => {
      this.change.emit(this.formGroup);
    });

    this.chartForm.controls.type.valueChanges.subscribe((value) => {
      this.type = this.types.find((x) => x.name === value);
    });
  }

  /**
   *  Handles the a tab change event
   *
   * @param event Event triggered on tab switch
   */
  handleTabChange(event: number): void {
    this.selectedTab = event;
  }
}
