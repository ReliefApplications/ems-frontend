import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { SafeDateTranslateService } from '../../services/date-translate.service';

/** Preferences Dialog Data */
interface PreferencesDialogData {
  languages: string[];
}

/**
 * Preferences Modal.
 */
@Component({
  selector: 'safe-preferences-modal',
  templateUrl: './preferences-modal.component.html',
  styleUrls: ['./preferences-modal.component.scss'],
})
export class SafePreferencesModalComponent implements OnInit {
  // === REACTIVE FORM ===
  public preferencesForm: FormGroup = new FormGroup({});

  // === DATA ===
  languages: { name: string; value: string }[] = [];
  currLang: string;
  dateFormats: { name: string | null; value: string }[] = [];
  currDateLang: string;

  /**
   * Preferences Modal.
   *
   * @param data modal data
   * @param formBuilder Angular form builder
   * @param translate Angular translate service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreferencesDialogData,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dateTranslate: SafeDateTranslateService
  ) {
    // find the current language
    this.currLang = this.translate.currentLang || this.translate.defaultLang;
    // find the list of languages and their complete names
    this.languages = data.languages.map((code: string) => ({
      value: code,
      name: this.getLanguageName(code, this.currLang),
    }));

    // find the current date language
    this.currDateLang = this.dateTranslate.currentLang;
    // find the list of languages with their example date formats
    this.dateFormats = data.languages
      .map((code: string) => ({
        value: code,
        name: this.getdateFormatText(code),
      }))
      .filter((dateLang) => dateLang.name);
  }

  ngOnInit(): void {
    // this.getLocalizedLangNames();
    this.preferencesForm = this.formBuilder.group({
      // initializes select field with current language
      language: [this.currLang, Validators.required],
      // initializes select field with current date language format
      dateFormat: [this.currDateLang, Validators.required],
    });
  }

  /**
   * Get the full name of a language from its code
   *
   * @param lang The code of the language we want the name of
   * @param displayLang The code of the language in which we want the name translated
   * @returns The language name
   */
  private getLanguageName(lang: string, displayLang: string): string {
    // create the DisplayNames object if not created
    let displayNameObject: any;
    try {
      // try to get names for the asking language
      displayNameObject = new (Intl as any).DisplayNames(displayLang, {
        type: 'language',
      });
    } catch {
      // if displayLang is not a language, fall back to english
      displayNameObject = new (Intl as any).DisplayNames('en', {
        type: 'language',
      });
    }
    // get the language name
    try {
      return displayNameObject.of(lang);
    } catch {
      return lang;
    }
  }

  /**
   * Get an example short date in a certain language format
   *
   * @param lang The language in which we want the date
   * @returns The date formated as a string
   */
  private getdateFormatText(lang: string): string | null {
    const date = new Date(1984, 0, 24, 8, 34);
    try {
      const datePipe = new DatePipe(lang);
      return `(${lang.toUpperCase()}) ${datePipe.transform(date, 'short')}`;
    } catch {
      return null;
    }
  }
}
