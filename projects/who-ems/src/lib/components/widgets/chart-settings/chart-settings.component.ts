import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
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
  showFilter = false;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = chartTypes;

  // === QUERY BUILDER ===
  public availableQueries: Observable<any[]>;
  public availableFields: any[];
  public availableFilter: any[];

  get selectedFields(): string[] {
    return this.tileForm.value.fields;
  }

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
        xAxis: [(tileSettings && tileSettings.xAxis) ? tileSettings.xAxis : '', Validators.required],
        yAxis: [(tileSettings && tileSettings.yAxis) ? tileSettings.yAxis : '', Validators.required],
        queryType: [(tileSettings && tileSettings.queryType) ? tileSettings.queryType : '', Validators.required],
        fields: [(tileSettings && tileSettings.fields) ? tileSettings.fields : null, Validators.required],
        sortField: [(tileSettings && tileSettings.sortField) ? tileSettings.sortField : null],
        sortOrder: [(tileSettings && tileSettings.sortOrder) ? tileSettings.sortOrder : null],
        filter: this.formBuilder.group({})
      }
    );
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    this.availableQueries = this.queryBuilder.availableQueries;
    this.availableQueries.subscribe((res) => {
      if (res) {
        this.availableFields = this.queryBuilder.getFields(this.tileForm.value.queryType);
        this.availableFilter = this.queryBuilder.getFilter(this.tileForm.value.queryType);
        this.tileForm.setControl('filter', this.createFilterGroup());
      }
    });
    this.tileForm.controls.queryType.valueChanges.subscribe((res) => {
      this.availableFields = this.queryBuilder.getFields(res);
      this.availableFilter = this.queryBuilder.getFilter(res);
      this.tileForm.setControl('filter', this.createFilterGroup());
      this.tileForm.controls.xAxis.setValue('');
      this.tileForm.controls.yAxis.setValue('');
    });
  }

  private createFilterGroup(): FormGroup {
    const filter = this.tile.settings.filter;
    const group = this.availableFilter.reduce((o, key) => {
      return ({...o, [key.name]: [(filter && filter[key.name] ? filter[key.name] : null )]});
    }, {});
    return this.formBuilder.group(group);
  }

  public toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }
}
