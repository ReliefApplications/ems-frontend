import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  ButtonModule,
  CheckboxModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  UniquenessCondition,
  UniquenessRule,
} from '../../models/resource.model';

/** Data passed to the edit uniqueness rule modal */
export interface EditUniquenessRuleModalData {
  rule?: UniquenessRule;
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
 * Modal used to add or edit a single scoped uniqueness rule of a resource.
 * A rule lists one or more fields that must be unique (alone, or in
 * combination) across all records of the resource, optionally restricted
 * to records matching a condition or checked as a date-range overlap, and
 * whether a violation should block saving or only warn the user.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    TooltipModule,
  ],
  selector: 'shared-edit-uniqueness-rule-modal',
  templateUrl: './edit-uniqueness-rule-modal.component.html',
  styleUrls: ['./edit-uniqueness-rule-modal.component.scss'],
})
export class EditUniquenessRuleModalComponent {
  /** Names of the fields available on the resource */
  public fieldNames: string[] = (this.data.fields || [])
    .map((field: any) => field.name)
    .filter((name: string) => !!name);

  /** Reactive form for the rule */
  public form: FormGroup = this.createRuleGroup(this.data.rule);

  /**
   * EditUniquenessRuleModalComponent constructor.
   *
   * @param fb Used to build the reactive form.
   * @param dialogRef Reference to the current dialog.
   * @param data Data passed to the modal (the rule being edited, if any, and the resource fields).
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<UniquenessRule>,
    @Inject(DIALOG_DATA) public data: EditUniquenessRuleModalData
  ) {}

  /**
   * The 'only apply when' conditions form array.
   *
   * @returns the condition form array
   */
  get conditions(): FormArray<FormGroup> {
    return this.form.get('condition') as FormArray<FormGroup>;
  }

  /**
   * The rule, formatted for saving.
   *
   * @returns the uniqueness rule
   */
  get value(): UniquenessRule {
    const rule = this.form.getRawValue();
    return {
      name: rule.name || undefined,
      fields: rule.fields,
      severity: rule.severity,
      message: rule.message || undefined,
      active: rule.active,
      showMatches: rule.showMatches,
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
    };
  }

  /**
   * Builds the reactive form for the rule.
   *
   * @param rule existing rule to populate the form with, if any
   * @returns the form group
   */
  private createRuleGroup(rule?: UniquenessRule): FormGroup {
    return this.fb.group({
      name: [rule?.name || ''],
      fields: [rule?.fields || [], Validators.required],
      severity: [rule?.severity || 'error', Validators.required],
      message: [rule?.message || ''],
      active: [rule?.active !== false],
      showMatches: [!!rule?.showMatches],
      condition: new FormArray<FormGroup>(
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

  /** Adds a new, empty condition. */
  addCondition(): void {
    this.conditions.push(this.createConditionGroup());
  }

  /**
   * Removes a condition.
   *
   * @param index index of the condition to remove
   */
  removeCondition(index: number): void {
    this.conditions.removeAt(index);
  }

  /** Closes the modal, sending the rule back to the caller. */
  onSubmit(): void {
    this.dialogRef.close(this.value);
  }
}
