import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

/** Preferences Dialog Data */
interface PreferencesDialogData {
  languages: string[];
}

const AVAILABLE_LANGUAGES = [
  {
    name: 'English',
    value: 'en',
  },
  {
    name: 'Test',
    value: 'test',
  },
];

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
    this.languages = AVAILABLE_LANGUAGES.filter((x) =>
      environment.availableLanguages.includes(x.value)
    );
  }

  ngOnInit(): void {
    // this.getLocalizedLangNames();
    this.preferencesForm = this.formBuilder.group({
      // initializes select field with current language
      language: [this.currLang, Validators.required],
    });
  }
}
