import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  UniquenessCondition,
  UniquenessRule,
} from '../../../models/resource.model';

/** Data passed to the edit uniqueness rules modal */
export interface EditUniquenessRulesData {
  rules: UniquenessRule[];
  fields: any[];
}

/**
 * Turns a condition value typed as free text back into its likely original
 * type - only 'true'/'false' are special-cased, everything else (including
 * numeric-looking strings) is kept as-is, since field values are compared
 * for strict equality against what is actually stored on records.
 *
 * @param raw the raw string entered by the user
 * @returns the coerced value
 */
const coerceConditionValue = (raw: string): any => {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return raw;
};

/**
 * Modal used to add, edit and remove the scoped uniqueness rules of a
 * resource. Each rule lists one or more fields that must be unique
 * (alone, or in combination) across all records of the resource, and
 * whether a violation should block saving or only warn the user.
 */
@Component({
  selector: 'shared-edit-uniqueness-rules',
  templateUrl: './edit-uniqueness-rules.component.html',
  styleUrls: ['./edit-uniqueness-rules.component.scss'],
})
export class EditUniquenessRulesComponent implements OnInit {
  /** Reactive form, wrapping the rules form array */
  public form!: FormGroup;
  /** Names of the fields available on the resource */
  public fieldNames: string[] = [];

  /**
   * EditUniquenessRulesComponent constructor.
   *
   * @param fb Used to build the reactive form.
   * @param dialogRef Reference to the current dialog.
   * @param data Data passed to the modal (current rules and resource fields).
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<UniquenessRule[]>,
    @Inject(DIALOG_DATA) public data: EditUniquenessRulesData
  ) {}

  ngOnInit(): void {
    this.fieldNames = (this.data.fields || [])
      .map((field) => field.name)
      .filter((name) => !!name);
    this.form = this.fb.group({
      rules: this.fb.array(
        (this.data.rules || []).map((rule) => this.createRuleGroup(rule))
      ),
    });
  }

  /**
   * The form array holding one group per rule.
   *
   * @returns the rules form array
   */
  get rules(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  /**
   * The rules, formatted for saving.
   *
   * @returns the list of uniqueness rules
   */
  get value(): UniquenessRule[] {
    return this.rules.value.map((rule: any) => ({
      name: rule.name || undefined,
      fields: rule.fields,
      severity: rule.severity,
      message: rule.message || undefined,
      condition: rule.condition?.length
        ? rule.condition.map((c: any) => ({
            field: c.field,
            operator: c.operator,
            value: coerceConditionValue(c.value),
          }))
        : undefined,
      dateIntersection:
        rule.dateIntersectionEnabled &&
        rule.dateIntersection?.startField &&
        rule.dateIntersection?.endField
          ? {
              startField: rule.dateIntersection.startField,
              endField: rule.dateIntersection.endField,
              allowAdjacent: !!rule.dateIntersection.allowAdjacent,
            }
          : undefined,
    }));
  }

  /**
   * Builds a form group for a single rule.
   *
   * @param rule existing rule to populate the group with, if any
   * @returns the form group
   */
  private createRuleGroup(rule?: UniquenessRule): FormGroup {
    return this.fb.group({
      name: [rule?.name || ''],
      fields: [rule?.fields || [], Validators.required],
      severity: [rule?.severity || 'error', Validators.required],
      message: [rule?.message || ''],
      condition: this.fb.array(
        (rule?.condition || []).map((c) => this.createConditionGroup(c))
      ),
      dateIntersectionEnabled: [
        !!(
          rule?.dateIntersection?.startField && rule?.dateIntersection?.endField
        ),
      ],
      dateIntersection: this.fb.group({
        startField: [rule?.dateIntersection?.startField || ''],
        endField: [rule?.dateIntersection?.endField || ''],
        allowAdjacent: [!!rule?.dateIntersection?.allowAdjacent],
      }),
    });
  }

  /**
   * Builds a form group for a single 'only apply when' condition.
   *
   * @param condition existing condition to populate the group with, if any
   * @returns the form group
   */
  private createConditionGroup(condition?: UniquenessCondition): FormGroup {
    return this.fb.group({
      field: [condition?.field || '', Validators.required],
      operator: [condition?.operator || 'eq', Validators.required],
      value: [
        condition?.value !== undefined ? String(condition.value) : '',
        Validators.required,
      ],
    });
  }

  /** Adds a new, empty rule to the list */
  addRule(): void {
    this.rules.push(this.createRuleGroup());
  }

  /**
   * Removes a rule from the list.
   *
   * @param index index of the rule to remove
   */
  removeRule(index: number): void {
    this.rules.removeAt(index);
  }

  /**
   * The 'only apply when' conditions of a given rule.
   *
   * @param ruleIndex index of the rule
   * @returns the condition form array
   */
  conditions(ruleIndex: number): FormArray {
    return this.rules.at(ruleIndex).get('condition') as FormArray;
  }

  /**
   * Adds a new, empty condition to a rule.
   *
   * @param ruleIndex index of the rule
   */
  addCondition(ruleIndex: number): void {
    this.conditions(ruleIndex).push(this.createConditionGroup());
  }

  /**
   * Removes a condition from a rule.
   *
   * @param ruleIndex index of the rule
   * @param conditionIndex index of the condition to remove
   */
  removeCondition(ruleIndex: number, conditionIndex: number): void {
    this.conditions(ruleIndex).removeAt(conditionIndex);
  }

  /** Closes the modal without saving any change. */
  onClose(): void {
    this.dialogRef.close();
  }
}
