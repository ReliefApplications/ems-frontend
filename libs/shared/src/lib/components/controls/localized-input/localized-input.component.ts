import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { LocalizedString } from '../../../models/localized-string.model';

/** Locales the platform supports for user content. Mirrors the i18n bundles. */
export const SUPPORTED_LOCALES = ['en', 'fr', 'uk'] as const;

/** A locale code from {@link SUPPORTED_LOCALES}. */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Locales offered when editing user content: the supported ones that are
 * enabled in the environment ( `availableLanguages` ). Every supported locale
 * is offered when the environment does not list any of them.
 *
 * @param environment Injected environment, if any.
 * @returns Locales to render as tabs, in {@link SUPPORTED_LOCALES} order.
 */
export const getContentLocales = (
  environment?: { availableLanguages?: string[] } | null
): readonly SupportedLocale[] => {
  const available = environment?.availableLanguages ?? [];
  const enabled = SUPPORTED_LOCALES.filter((locale) =>
    available.includes(locale)
  );
  return enabled.length ? enabled : SUPPORTED_LOCALES;
};

/**
 * Single text input with a per-locale tab strip. Lets a user enter different
 * values for each supported language and emits the result as a
 * {@link LocalizedString} via Reactive Forms / `ngModel`.
 */
@Component({
  selector: 'shared-localized-input',
  templateUrl: './localized-input.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocalizedInputComponent),
      multi: true,
    },
  ],
})
export class LocalizedInputComponent implements ControlValueAccessor {
  /** Render as `<input>` (default) or `<textarea>`. */
  @Input() type: 'text' | 'textarea' = 'text';

  /** Placeholder displayed while the active locale has no value. */
  @Input() placeholder = '';

  /** List of locales rendered as tabs, exposed for the template. */
  readonly locales: readonly SupportedLocale[];

  /** Locale currently visible in the input. */
  activeLocale: SupportedLocale;

  /** Per-locale text values. */
  values: Partial<Record<SupportedLocale, string>> = {};

  /** Mirrors the form-control disabled state. */
  disabled = false;

  /**
   * Form-control change callback registered by Angular.
   *
   * @returns Nothing; invoked for its side effect on the form-control.
   */
  private onChange: (v: LocalizedString) => void = () => undefined;

  /**
   * Form-control touched callback registered by Angular.
   *
   * @returns Nothing; invoked for its side effect on the form-control.
   */
  private onTouched: () => void = () => undefined;

  /**
   * Single text input with a per-locale tab strip.
   *
   * @param environment Injected environment ( available languages )
   */
  constructor(@Optional() @Inject('environment') environment: any) {
    this.locales = getContentLocales(environment);
    this.activeLocale = this.locales[0];
  }

  /**
   * Accepts either a plain string (treated as the English entry, for
   * back-compat with non-localized values) or a per-locale map. Values of
   * locales that are not enabled in the environment are kept, so they are not
   * lost when the field is saved.
   *
   * @param value Incoming form value.
   */
  writeValue(value: LocalizedString | null | undefined): void {
    if (value == null) {
      this.values = {};
      return;
    }
    if (typeof value === 'string') {
      this.values = value ? { en: value } : {};
      return;
    }
    const next: Partial<Record<SupportedLocale, string>> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const v = value[locale];
      if (v) next[locale] = v;
    }
    this.values = next;
  }

  /**
   * Registers the form-control change callback.
   *
   * @param fn Callback invoked when the value changes.
   */
  registerOnChange(fn: (v: LocalizedString) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers the form-control touched callback.
   *
   * @param fn Callback invoked when the field is touched.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Mirrors the form-control disabled state onto the input.
   *
   * @param isDisabled Whether the field should be disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Switch the active locale tab. Marks the field as touched.
   *
   * @param locale Locale to activate.
   */
  setLocale(locale: SupportedLocale): void {
    this.activeLocale = locale;
    this.onTouched();
  }

  /**
   * Update the value for the active locale and emit the full map.
   *
   * @param value New text value for the active locale.
   */
  onInput(value: string): void {
    if (value) {
      this.values = { ...this.values, [this.activeLocale]: value };
    } else {
      const next = { ...this.values };
      delete next[this.activeLocale];
      this.values = next;
    }
    this.onChange({ ...this.values });
  }

  /**
   * Checks whether a specific locale has a non-empty value.
   *
   * @param locale Locale to check.
   * @returns True when the locale has a non-empty value.
   */
  hasContent(locale: SupportedLocale): boolean {
    return !!this.values[locale];
  }
}
