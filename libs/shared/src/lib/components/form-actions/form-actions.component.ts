import { Component, Input, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';
import { getLanguageNativeName } from '../../utils/languages';

/** Interface for a lang object */
interface LangObject {
  code: string;
  nativeName: string;
}

/** Default locale of the survey */
const DEFAULT_LOCALE_SURVEY: LangObject = {
  code: Survey.surveyLocalization.defaultLocale,
  nativeName: getLanguageNativeName(Survey.surveyLocalization.defaultLocale),
};

/**
 * Component for the language selection dropdown for surveys
 */
@Component({
  selector: 'shared-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss'],
})
export class FormActionsComponent implements OnInit {
  @Input() survey!: Survey.SurveyModel;
  @Input() surveyNext?: Survey.SurveyModel;
  @Input() surveyActive = true;
  public usedLocalesSurvey: LangObject[] = [];
  public currentLocaleSurvey = DEFAULT_LOCALE_SURVEY;

  ngOnInit(): void {
    // set the available languages and default language of the survey
    this.usedLocalesSurvey = this.survey?.getUsedLocales().map((lang) => ({
      code: lang,
      nativeName: getLanguageNativeName(lang),
    }));
    this.currentLocaleSurvey =
      this.usedLocalesSurvey.find((x) => x.code === this.survey?.locale) ||
      DEFAULT_LOCALE_SURVEY;
  }

  /**
   * Change language of the form.
   *
   * @param langItem The selected language
   */
  public setLanguage(langItem: LangObject): void {
    this.survey.locale = langItem.code;
    this.survey.render();
    if (this.surveyNext) {
      this.surveyNext.locale = langItem.code;
      this.surveyNext.render();
    }
    this.currentLocaleSurvey = langItem;
    localStorage.setItem('surveyLang', langItem.code);
    // this.survey.render(this.containerId);
  }
}
