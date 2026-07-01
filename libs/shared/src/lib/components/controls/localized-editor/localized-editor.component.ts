import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { EditorModule as TinyMceEditorModule } from '@tinymce/tinymce-angular';
import { LocalizedString } from '../../../models/localized-string.model';
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
} from '../localized-input/localized-input.component';

/**
 * TinyMCE editor with a per-locale tab strip. Holds one HTML draft per
 * supported language and emits the result as a {@link LocalizedString} via
 * Reactive Forms / `ngModel`. The active tab decides which locale's HTML the
 * editor instance is currently editing.
 */
@Component({
  selector: 'shared-localized-editor',
  templateUrl: './localized-editor.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, TinyMceEditorModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocalizedEditorComponent),
      multi: true,
    },
  ],
})
export class LocalizedEditorComponent implements ControlValueAccessor {
  /** TinyMCE init config, forwarded to the underlying `<editor>`. */
  @Input() init: any;

  /** List of locales rendered as tabs, exposed for the template. */
  readonly locales = SUPPORTED_LOCALES;

  /** Locale currently visible in the editor. */
  activeLocale: SupportedLocale = 'en';

  /** Per-locale HTML drafts. */
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
   * @returns HTML for the active locale, or empty string.
   */
  get currentText(): string {
    return this.values[this.activeLocale] ?? '';
  }

  /**
   * Accepts either a plain string (treated as the English entry, for
   * back-compat with non-localized values) or a per-locale map.
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
   * Mirrors the form-control disabled state onto the editor.
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
   * Update the HTML for the active locale and emit the full map.
   *
   * @param html New HTML for the active locale.
   */
  onEditorChange(html: string): void {
    if (html) {
      this.values = { ...this.values, [this.activeLocale]: html };
    } else {
      const next = { ...this.values };
      delete next[this.activeLocale];
      this.values = next;
    }
    this.onChange({ ...this.values });
  }

  /**
   * Checks whether a specific locale has non-empty HTML.
   *
   * @param locale Locale to check.
   * @returns True when the locale has non-empty HTML.
   */
  hasContent(locale: SupportedLocale): boolean {
    return !!this.values[locale];
  }
}
