import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { chartTypes } from './constants';

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

  public selectedFields: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group(
      {
        id: this.tile.id,
        title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
        type: [(tileSettings && tileSettings.type) ? tileSettings.type : '', Validators.required],
        query: this.queryBuilder.createQueryForm(tileSettings.query),
        xAxis: [(tileSettings && tileSettings.xAxis) ? tileSettings.xAxis : '', Validators.required],
        yAxis: [(tileSettings && tileSettings.yAxis) ? tileSettings.yAxis : '', Validators.required]
      }
    );
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    if (this.tileForm.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm.value.query.fields);
    }

    const queryForm = this.tileForm.get('query') as FormGroup;

    queryForm.controls.name.valueChanges.subscribe(() => {
      this.tileForm.controls.xAxis.setValue('');
      this.tileForm.controls.yAxis.setValue('');
    });
    queryForm.valueChanges.subscribe((res) => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
    });
  }

  private flatDeep(arr: any[]): any[] {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), []);
  }

  private getFields(fields: any[], prefix?: string): any[] {
    return this.flatDeep(fields.filter(x => x.kind !== 'LIST').map(f => {
      console.log(f);
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
