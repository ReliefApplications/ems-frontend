import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { isEmpty } from 'lodash';
import { AggregationBuilderService } from '../../../../../services/aggregation-builder.service';
import { Accumulators, DateOperators } from '../expressions/operators';

/**
 * Group Stage pipeline component.
 */
@Component({
  selector: 'safe-group-stage',
  templateUrl: './group-stage.component.html',
  styleUrls: ['./group-stage.component.scss'],
})
export class SafeGroupStageComponent implements OnInit {
  @Input() form!: AbstractControl;
  @Input() fields: any[] = [];
  public operators = Accumulators;
  public dateOperators = DateOperators;
  public displayDateOperators = false;

  get formGroup() {
    return this.form as FormGroup;
  }

  get addFields() {
    return this.formGroup.controls.addFields as FormArray;
  }

  constructor(private aggregationBuilder: AggregationBuilderService) {}

  ngOnInit(): void {
    const groupBy = this.form.value.groupBy;
    if (groupBy) {
      this.displayDateOperators = this.isDateField(groupBy);
    }
    this.form.get('groupBy')?.valueChanges.subscribe((fieldName) => {
      if (fieldName) {
        this.displayDateOperators = this.isDateField(fieldName);
        if (!this.displayDateOperators) {
          this.form.get('groupByExpression')?.get('operator')?.setValue(null);
        }
      }
    });
  }

  /**
   * Check if selected field is a date field.
   *
   * @param fieldName Selected field name.
   * @returns Boolean.
   */
  private isDateField(fieldName: string): boolean {
    const field = this.aggregationBuilder.findField(fieldName, this.fields);
    if (!isEmpty(field)) {
      if (fieldName.includes('.')) {
        const fieldArray = fieldName.split('.');
        const sub = fieldArray.pop();
        return field.fields.some(
          (x: any) => x.name === sub && x.type.name === 'DateTime'
        );
      } else {
        return field.type.name === 'DateTime';
      }
    }
    return false;
  }
}
