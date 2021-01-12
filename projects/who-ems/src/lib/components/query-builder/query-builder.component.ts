import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder.service';

@Component({
  selector: 'who-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class WhoQueryBuilderComponent implements OnInit {

  // === QUERY BUILDER ===
  public availableQueries: Observable<any[]>;
  public availableFields: any[];
  public availableFilters: any[];

  get availableScalarFields(): any[] {
    return this.availableFields.filter(x => x.type.kind === 'SCALAR');
  }

  @Input() form: FormGroup;
  @Input() settings: any;

  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) { }

  ngOnInit(): void {
    this.availableQueries = this.queryBuilder.availableQueries;
    this.availableQueries.subscribe((res) => {
      if (res) {
      this.availableFields = this.queryBuilder.getFields(this.form.value.name);
      this.availableFilters = this.queryBuilder.getFilter(this.form.value.queryType);
      this.form.setControl('filter', this.createFilterGroup(this.settings.filter, this.availableFilters));
      }
    });
    this.form.controls.name.valueChanges.subscribe((res) => {
      this.availableFields = this.queryBuilder.getFields(res);
      this.availableFilters = this.queryBuilder.getFilter(res);
      this.form.setControl('filter', this.createFilterGroup(null, this.availableFilters));
    });
  }

  private createFilterGroup(filter: any, availableFilter: any): FormGroup {
    const group = availableFilter.reduce((o, key) => {
      return ({...o, [key.name]: [(filter && ( filter[key.name] || filter[key.name] === false ) ? filter[key.name] : null )]});
    }, {});
    return this.formBuilder.group(group);
  }

}
