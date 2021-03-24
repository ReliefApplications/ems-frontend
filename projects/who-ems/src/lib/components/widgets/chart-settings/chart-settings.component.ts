import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { Chart } from './charts/chart';
import { chartTypes, LEGEND_ORIENTATIONS, LEGEND_POSITIONS, TITLE_POSITIONS } from './constants';

@Component({
  selector: 'who-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss']
})
/*  Modal content for the settings of the chart widgets.
*/
export class WhoChartSettingsComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = chartTypes;
  public legendPositions = LEGEND_POSITIONS;
  public legendOrientations = LEGEND_ORIENTATIONS;
  public titlePositions = TITLE_POSITIONS;
  public chart: Chart;
  public type: any;

  public get chartForm(): FormGroup {
    return this.tileForm.controls.chart as FormGroup;
  }

  // public get type(): object {
  //   return this.types.find(x => x.name === this.tileForm.value.chart.type);
  // }

  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    const chartSettings = tileSettings.chart;
    if (chartSettings.type) {
      this.type = this.types.find(x => x.name === chartSettings.type);
      this.chart = new (this.types.find(x => x.name === chartSettings.type).class)(chartSettings);
    } else {
      this.type = null;
      this.chart = new Chart(tileSettings);
    }
    this.tileForm = this.formBuilder.group(
      {
        id: this.tile.id,
        title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
        chart: this.chart.form
      }
    );
    this.change.emit(this.tileForm);

    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    // if (this.tileForm.value.query.name) {
    //   this.selectedFields = this.getFields(this.tileForm.value.query.fields);
    // }

    const chartForm = this.tileForm.get('chart') as FormGroup;
    chartForm.controls.type.valueChanges.subscribe((value) => {
      this.type = this.types.find(x => x.name === value);
    });

    // queryForm.controls.name.valueChanges.subscribe(() => {
    //   this.tileForm.controls.xAxis.setValue('');
    //   this.tileForm.controls.yAxis.setValue('');
    // });
    // queryForm.valueChanges.subscribe((res) => {
    //   this.selectedFields = this.getFields(queryForm.getRawValue().fields);
    // });
  }

  private flatDeep(arr: any[]): any[] {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), []);
  }

  private getFields(fields: any[], prefix?: string): any[] {
    return this.flatDeep(fields.filter(x => x.kind !== 'LIST').map(f => {
      switch (f.kind) {
        case 'OBJECT': {
          return this.getFields(f.fields, f.name);
        }
        default: {
          return prefix ? `${prefix}.${f.name}` : f.name;
        }
      }
    }));
  }
}
