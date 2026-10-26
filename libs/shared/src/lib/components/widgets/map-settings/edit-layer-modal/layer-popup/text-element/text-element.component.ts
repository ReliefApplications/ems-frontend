import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorService } from '../../../../../../services/editor/editor.service';
import { POPUP_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Fields } from '../../../../../../models/layer.model';
import { Observable, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';
import { SpinnerModule } from '@oort-front/ui';
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
} from '../../../../../controls/localized-input/localized-input.component';
import { LocalizedString } from '../../../../../../models/localized-string.model';

/**
 * Popup text element component.
 */
@Component({
  selector: 'shared-text-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    SpinnerModule,
  ],
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss'],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TextElementComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Tinymce editor configuration */
  public editor: any = POPUP_EDITOR_CONFIG;
  /** Is editor loading */
  public editorLoading = true;
  /** List of locales rendered as tabs. */
  public readonly locales = SUPPORTED_LOCALES;
  /** Locale currently being edited. */
  public activeLocale: SupportedLocale = 'en';
  /** Per-locale rich text values. */
  public values: Partial<Record<SupportedLocale, string>> = {};

  /**
   * Popup text element component.
   *
   * @param editorService Shared tinymce editor service
   */
  constructor(private editorService: EditorService) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    // Initialize the per-locale values from the (possibly legacy plain string)
    // form control value.
    this.values = this.toLocaleMap(this.formGroup.get('text')?.value);
    // Listen to fields changes
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const keys = value.map((field) => ({
        value: `{{${field.name}}}`,
        text: `{{${field.name}}}`,
      }));
      this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
    });
  }

  /**
   * Switch the locale currently being edited.
   *
   * @param locale Locale to activate.
   */
  setLocale(locale: SupportedLocale): void {
    this.activeLocale = locale;
  }

  /**
   * Update the value for the active locale and patch the form control with the
   * full per-locale map.
   *
   * @param value New rich text value for the active locale.
   */
  onEditorChange(value: string): void {
    if (value) {
      this.values = { ...this.values, [this.activeLocale]: value };
    } else {
      const next = { ...this.values };
      delete next[this.activeLocale];
      this.values = next;
    }
    const control = this.formGroup.get('text');
    control?.setValue({ ...this.values });
    control?.markAsDirty();
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

  /**
   * Normalizes a {@link LocalizedString} (plain string or per-locale map) into a
   * locale map. A plain string is treated as the English entry for backward
   * compatibility with non-localized values.
   *
   * @param value Incoming form value.
   * @returns Per-locale value map.
   */
  private toLocaleMap(
    value: LocalizedString | null | undefined
  ): Partial<Record<SupportedLocale, string>> {
    if (value == null) return {};
    if (typeof value === 'string') return value ? { en: value } : {};
    const next: Partial<Record<SupportedLocale, string>> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const v = value[locale];
      if (v) next[locale] = v;
    }
    return next;
  }
}
