import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
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
  // public fields = [];
  public types = chartTypes;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo
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
        query: [(tileSettings && tileSettings.query) ? tileSettings.query : '', Validators.required],
        xAxis: [(tileSettings && tileSettings.xAxis) ? tileSettings.xAxis : '', Validators.required],
        yAxis: [(tileSettings && tileSettings.yAxis) ? tileSettings.yAxis : '', Validators.required]
      }
    );
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
  }
}
