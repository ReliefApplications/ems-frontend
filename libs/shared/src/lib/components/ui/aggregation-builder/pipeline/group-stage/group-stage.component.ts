import { Component, OnInit, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { isEmpty } from 'lodash';
import { AggregationBuilderService } from '../../../../../services/aggregation-builder/aggregation-builder.service';
import { groupByRuleForm } from '../../aggregation-builder-forms';
import { Accumulators, DateOperators } from '../expressions/operators';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Group Stage pipeline component.
 */
@Component({
  selector: 'shared-group-stage',
  templateUrl: './group-stage.component.html',
  styleUrls: ['./group-stage.component.scss'],
})
export class GroupStageComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Input decorator for form. */
  @Input() form!: AbstractControl;
  /** Input decorator for fields. */
  @Input() fields: any[] = [];
  /** Public variable for operators. */
  public operators = Accumulators;
  /** Public variable for date operators. */
  public dateOperators = DateOperators;
  /** Array to hold the used date fields. */
  public usedDateFields: string[] = [];

  /** @returns this for as form group */
  get formGroup() {
    return this.form as UntypedFormGroup;
  }

  /** @returns list of addFields of the stage as Form array */
  get addFields() {
    return this.formGroup.controls.addFields as UntypedFormArray;
  }

  /**
   * GroupBy form as form array
   *
   * @returns form array
   */
  get groupBy(): UntypedFormArray {
    return this.formGroup.controls.groupBy as UntypedFormArray;
  }

  /**
   * Group Stage pipeline component.
   *
   * @param aggregationBuilder Shared aggregation builder service
   */
  constructor(private aggregationBuilder: AggregationBuilderService) {
    super();
  }

  /** OnInit lifecycle hook. */
  ngOnInit(): void {
    this.getDateFields(this.groupBy.value);
    this.groupBy.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.getDateFields(value);
      });
  }

  /**
   * Create a new groupBy rule
   */
  public onAddRule(): void {
    this.groupBy.push(groupByRuleForm(null));
  }

  /**
   * Delete groupBy rule at specified index
   *
   * @param index index of rule to remove
   */
  public onDeleteRule(index: number): void {
    this.groupBy.removeAt(index);
  }

  /**
   * Retrieve list of date fields from groupBy rules
   *
   * @param value value of the groupBy form
   */
  private getDateFields(value: any[]): void {
    const fields = [];
    for (const [index, rule] of value.entries()) {
      if (rule.field && this.isDateField(rule.field)) {
        fields.push(rule.field);
      } else {
        this.groupBy
          .at(index)
          .patchValue({ expression: { operator: null } }, { emitEvent: false });
      }
    }
    this.usedDateFields = fields;
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
