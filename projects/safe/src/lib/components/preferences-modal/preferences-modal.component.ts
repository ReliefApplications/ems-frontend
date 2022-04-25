import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

interface PreferencesDialogData {
  languages: string[];
}
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreferencesDialogData,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.currLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.getLocalizedLangNames();
    this.preferencesForm = this.formBuilder.group({
      // initializes select field with current language
      language: [this.currLang, Validators.required],
    });
  }

  /**
   * Initializes the languages array.
   * Gets the translated language name for each of the available languages.
   */
  getLocalizedLangNames() {
    this.data.languages.forEach((lang, i) => {
      this.translate.use(lang).subscribe((translations) => {
        this.languages.push({
          name: translations.language.name,
          value: lang,
        });

        // in the end, the original selected language is maintained
        const isLastLang = i === this.data.languages.length - 1;
        if (isLastLang) this.translate.use(this.currLang);
      });
    });
  }
}
