import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { isEmpty } from 'lodash';
import { AggregationBuilderService } from '../../../../../services/aggregation-builder.service';
import { groupByRuleForm } from '../../aggregation-builder-forms';
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
  public usedDateFields: string[] = [];

  /**
   * Form as form group.
   *
   * @returns form group
   */
  get formGroup(): FormGroup {
    return this.form as FormGroup;
  }

  /**
   * AddFields form as form array
   *
   * @returns form array
   */
  get addFields(): FormArray {
    return this.formGroup.controls.addFields as FormArray;
  }

  /**
   * GroupBy form as form array
   *
   * @returns form array
   */
  get groupBy(): FormArray {
    return this.formGroup.controls.groupBy as FormArray;
  }

  /**
   * Group Stage pipeline component.
   *
   * @param aggregationBuilder Shared aggregation builder service
   */
  constructor(private aggregationBuilder: AggregationBuilderService) {}

  ngOnInit(): void {
    this.getDateFields(this.groupBy.value);
    this.groupBy.valueChanges.subscribe((value) => {
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
      if (this.isDateField(rule.field)) {
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
