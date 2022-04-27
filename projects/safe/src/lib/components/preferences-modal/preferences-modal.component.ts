import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

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

  /**
   * Preferences Modal.
   *
   * @param data modal data
   * @param formBuilder Angular form builder
   * @param translate Angular translate service
   */
  constructor(
    @Inject('environment') environment: any,
    @Inject(MAT_DIALOG_DATA) public data: PreferencesDialogData,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.currLang = this.translate.currentLang || this.translate.defaultLang;
    // create an object to get the language name from its code, displayed in
    // the current language
    const languageNames = new (Intl as any).DisplayNames(
      this.currLang !== 'test' ? this.currLang : 'en',
      { type: 'language' }
    );
    this.languages = environment.availableLanguages.map((code: string) => {
      try {
        return {
          value: code,
          name: languageNames.of(code),
        };
      } catch {
        // if the code is not a language, use the code as a name (eg: test)
        return {
          value: code,
          name: code,
        };
      }
    });
  }

  ngOnInit(): void {
    // this.getLocalizedLangNames();
    this.preferencesForm = this.formBuilder.group({
      // initializes select field with current language
      language: [this.currLang, Validators.required],
    });
  }
}
