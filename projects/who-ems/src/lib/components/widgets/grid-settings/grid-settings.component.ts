import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';

@Component({
  selector: 'who-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
/*  Modal content for the settings of the grid widgets.
*/
export class WhoGridSettingsComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup;
  showFilter = false;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === PARENT ===
  // public forms: any[] = [];

  // === CHILD ===
  // public subForms: any[] = [];

  // === QUERY BUILDER ===
  public availableQueries: Observable<any[]>;
  public availableFields: any[];
  public availableFilter: any[];
  public availableDetailsType: any[];
  public availableDetailsFields: any[];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
      queryType: [(tileSettings && tileSettings.queryType) ? tileSettings.queryType : '', Validators.required],
      fields: [(tileSettings && tileSettings.fields) ? tileSettings.fields : null, Validators.required],
      sortField: [(tileSettings && tileSettings.sortField) ? tileSettings.sortField : null],
      sortOrder: [(tileSettings && tileSettings.sortOrder) ? tileSettings.sortOrder : null],
      filter: this.formBuilder.group({}),
      details: this.formBuilder.group({
        type: [(tileSettings && tileSettings.details && tileSettings.details.list) ? tileSettings.details.list : null],
        fields: [(tileSettings && tileSettings.details && tileSettings.details.fields) ? tileSettings.details.fields : null],
      })

    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
    this.availableQueries = this.queryBuilder.availableQueries;
    this.availableQueries.subscribe((res) => {
      if (res) {
        this.availableFields = this.queryBuilder.getFields(this.tileForm.value.queryType);
        this.availableFilter = this.queryBuilder.getFilter(this.tileForm.value.queryType);
        this.availableDetailsType = this.queryBuilder.getListFields(this.tileForm.value.queryType);
        this.tileForm.setControl('filter', this.createFilterGroup());
      }
    });
    this.tileForm.controls.queryType.valueChanges.subscribe((res) => {
      this.availableFields = this.queryBuilder.getFields(res);
      this.availableFilter = this.queryBuilder.getFilter(res);
      this.availableDetailsType = this.queryBuilder.getListFields(res);
      this.tileForm.setControl('filter', this.createFilterGroup());
    });
    this.tileForm.get('details.type').valueChanges.subscribe((res) => {
      if (res) {
        const type = this.availableDetailsType.find(x => x.name === res).type.ofType.name;
        this.availableDetailsFields = this.queryBuilder.getFieldsFromType(type);
      } else {
        this.availableDetailsFields = [];
      }
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
