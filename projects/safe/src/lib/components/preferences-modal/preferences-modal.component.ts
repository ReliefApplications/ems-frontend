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
  languages: string[] = [];
  currLang: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreferencesDialogData,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.currLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.languages = this.data.languages;

    this.preferencesForm = this.formBuilder.group({
      language: [this.currLang, Validators.required],
    });
  }
}
