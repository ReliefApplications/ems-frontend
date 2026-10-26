import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { UniquenessRule } from '../../models/resource.model';
import {
  LocalizedString,
  resolveLocalizedString,
} from '../../models/localized-string.model';
import { LocalizedInputComponent } from '../controls/public-api';
import { FilterModule } from '../filter/filter.module';
import { createFilterGroup } from '../query-builder/query-builder-forms';

/** Data passed to the edit uniqueness rule modal */
export interface EditUniquenessRuleModalData {
  rule?: UniquenessRule;
  /** Fields of the resource */
  fields: any[];
  /** Fields of the resource, as expected by the filter builder ( metadata ) */
  filterFields?: any[];
}

/**
 * Whether a message is entered in at least one language.
 *
 * @param value message, as a plain text or by language
 * @returns true if the message is a non-empty set of translations
 */
const hasTranslations = (
  value?: LocalizedString | null
): value is Partial<Record<string, string>> =>
  !!value &&
  typeof value !== 'string' &&
  Object.values(value).some((text) => !!text);

/**
 * Modal used to add or edit a single scoped uniqueness rule of a resource.
 * A rule lists one or more fields that must be unique (alone, or in
 * combination) across all records of the resource, optionally restricted
 * to records matching a filter or checked as a date-range overlap, and
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
    LocalizedInputComponent,
    FilterModule,
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
   * @param translate Angular translate service.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<UniquenessRule>,
    @Inject(DIALOG_DATA) public data: EditUniquenessRuleModalData,
    private translate: TranslateService
  ) {}

  /**
   * The 'only apply when' filter form.
   *
   * @returns the filter form group
   */
  get conditionForm(): UntypedFormGroup {
    return this.form.get('condition') as UntypedFormGroup;
  }

  /**
   * The rule, formatted for saving.
   *
   * @returns the uniqueness rule
   */
  get value(): UniquenessRule {
    const rule = this.form.getRawValue();
    // The message is entered by language. Its value in the current language is
    // also saved as the plain message, used when there is no translation
    const message: LocalizedString = rule.message ?? '';
    return {
      name: rule.name || undefined,
      fields: rule.fields,
      severity: rule.severity,
      message:
        resolveLocalizedString(message, this.translate.currentLang) ||
        undefined,
      messageTranslations: hasTranslations(message) ? message : undefined,
      active: rule.active,
      // Same filter as the one of layouts. Without any condition, the rule
      // applies to all records
      condition: rule.condition?.filters?.length ? rule.condition : undefined,
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
      // Rules saved before messages could be translated only have a message
      message: [
        (hasTranslations(rule?.messageTranslations)
          ? rule?.messageTranslations
          : rule?.message || '') as LocalizedString,
      ],
      active: [rule?.active !== false],
      condition: createFilterGroup(rule?.condition ?? null),
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

  /** Closes the modal, sending the rule back to the caller. */
  onSubmit(): void {
    this.dialogRef.close(this.value);
  }
}
