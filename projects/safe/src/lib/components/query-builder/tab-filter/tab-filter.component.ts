import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { get } from 'lodash';
import { SafeGridService } from '../../../services/grid.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

/**
 * Component for displaying the filtering options
 */
@Component({
  selector: 'safe-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss'],
})
export class SafeTabFilterComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() query: any;
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  public filterFields: any[] = [];

  /**
   * Getter for the filters
   *
   * @returns The filters in an array
   */
  get filters(): FormArray {
    return this.form.get('filters') as FormArray;
  }

  private inputs = '';

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder This is the service that will be used to build the query.
   * @param gridService Shared grid service
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private gridService: SafeGridService
  ) {}

  ngOnInit(): void {
    // TODO: move somewhere else
    if (this.query) {
      const sourceQuery = this.queryBuilder.getQuerySource(this.query);
      if (sourceQuery) {
        sourceQuery.subscribe(async (res: any) => {
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              const source = get(res.data[field], '_source', null);
              if (source) {
                this.queryBuilder.getQueryMetaData(source).subscribe((res2) => {
                  if (res2.data.form) {
                    this.filterFields = get(
                      res2.data.form,
                      'metadata',
                      []
                    ).filter((x: any) => x.filterable !== false);
                  }
                  if (res2.data.resource) {
                    this.filterFields = get(
                      res2.data.resource,
                      'metadata',
                      []
                    ).filter((x: any) => x.filterable !== false);
                  }
                  // await this.gridService.populateMetaFields(this.metaFields);
                });
              }
            }
          }
        });
      }
    } else {
      this.gridService.populateMetaFields(this.metaFields);
      console.log(this.metaFields);
    }
  }

  /**
   * Get meta from filter name
   *
   * @param name field name
   * @returns meta or null
   */
  getMeta(name: string): any {
    return get(this.metaFields, name, null);
  }

  /**
   * Set the current date to today
   *
   * @param filterName Name of the filter to set the date to
   */
  setCurrentDate(filterName: string): void {
    this.form.controls[filterName].setValue('today()');
  }

  /**
   * Change editor for a field.
   * It is possible, for date questions, to use text editor instead of date selection.
   *
   * @param index index of filter field
   */
  onChangeEditor(index: number): void {
    const formGroup = this.filters.at(index) as FormGroup;
    formGroup
      .get('useExpression')
      ?.setValue(!formGroup.get('useExpression')?.value);
    formGroup.get('value')?.setValue(null);
  }

  /**
   * Handles the onKey event
   *
   * @param e Event to handle
   * @param filterName Name of the filter where the user typed
   */
  onKey(e: any, filterName: string): void {
    if (e.target.value === '') {
      this.inputs = '';
    }
    if (e.keyCode === 8) {
      this.inputs = this.inputs.slice(0, this.inputs.length - 1);
    }
    if (this.inputs.length <= 9) {
      if (RegExp('^[0-9]*$').test(e.key)) {
        if (this.inputs.length === 3 || this.inputs.length === 6) {
          this.inputs += e.key + '/';
          e.target.value += '/';
        } else {
          this.inputs += e.key;
        }
      } else if (e.key === '/') {
        e.stopPropagation();
        this.inputs = this.inputs.slice(0, this.inputs.length - 1);
      } else {
        e.stopPropagation();
        e.target.value = e.target.value.replace(/[^0-9\/]/g, '');
      }
    } else {
      e.stopPropagation();
      e.target.value = this.inputs;
    }
    if (
      this.inputs.length > 9 &&
      !RegExp('\\d{4}\\/(0?[1-9]|1[012])\\/(0?[1-9]|[12][0-9]|3[01])*').test(
        this.inputs
      )
    ) {
      this.form.controls[filterName].setErrors({ incorrect: true });
    }
  }
}
