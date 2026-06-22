import { AbstractControl, ValidationErrors } from '@angular/forms';
import { LocalizedString } from '../../models/localized-string.model';

/**
 * Required validator for a {@link LocalizedString}. Considers the field valid
 * when the value is a non-empty string or when at least one locale entry has
 * a non-empty value. Use in place of `Validators.required` for fields whose
 * type is a per-locale map.
 *
 * @param control Form control whose value is a {@link LocalizedString}.
 * @returns `{ required: true }` when no locale has content, `null` otherwise.
 */
export function localizedRequired(
  control: AbstractControl<LocalizedString | null | undefined>
): ValidationErrors | null {
  const value = control.value;
  if (value == null) return { required: true };
  if (typeof value === 'string') {
    return value.length > 0 ? null : { required: true };
  }
  const hasContent = Object.values(value).some((v) => !!v);
  return hasContent ? null : { required: true };
}
