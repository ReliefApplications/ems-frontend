import { Component, ComponentFactory, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  public factory: ComponentFactory<any>;

  get availableScalarFields(): any[] {
    return this.availableFields.filter(x => x.type.kind === 'SCALAR');
  }

  @Input() form: FormGroup;
  @Input() settings: any;
  @Input() canExpand = true;

  // === FIELD EDITION ===
  public isField: boolean;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) { }

  ngOnInit(): void {
    this.factory = this.componentFactoryResolver.resolveComponentFactory(WhoQueryBuilderComponent);
    if (this.form.value.type) {
      this.isField = true;
      this.availableFields = this.queryBuilder.getFieldsFromType(this.form.value.type)
        .filter(x => this.canExpand || x.type.kind !== 'LIST');
      if (this.form.get('filter')) {
        this.availableFilters = this.queryBuilder.getFilterFromType(this.form.value.type);
        this.form.setControl('filter',
          this.queryBuilder.createFilterGroup(this.form.value.filter, this.availableFilters));
      }
    } else {
      this.availableQueries = this.queryBuilder.availableQueries;
      this.availableQueries.subscribe((res) => {
        if (res) {
          this.availableFields = this.queryBuilder.getFields(this.form.value.name);
          this.availableFilters = this.queryBuilder.getFilter(this.form.value.name);
          this.form.setControl('filter', this.queryBuilder.createFilterGroup(this.form.value.filter, this.availableFilters));
        }
      });
      this.form.controls.name.valueChanges.subscribe((res) => {
        this.availableFields = this.queryBuilder.getFields(res);
        this.availableFilters = this.queryBuilder.getFilter(res);
        this.form.setControl('filter', this.queryBuilder.createFilterGroup(null, this.availableFilters));
        this.form.setControl('fields', this.formBuilder.array([]));
        this.form.setControl('sort', this.formBuilder.group({
          field: [''],
          order: ['asc']
        }));
      });
    }
  }

  onCloseField(): void {
    this.closeField.emit(true);
  }
}
