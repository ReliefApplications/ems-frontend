import { Component, Input, OnInit } from '@angular/core';
import { SurveyModel, surveyLocalization } from 'survey-core';
import { getLanguageNativeName } from '../../utils/languages';

/** Interface for a lang object */
interface LangObject {
  code: string;
  nativeName: string;
}

/** Default locale of the survey */
const DEFAULT_LOCALE_SURVEY: LangObject = {
  code: surveyLocalization.defaultLocale,
  nativeName: getLanguageNativeName(surveyLocalization.defaultLocale),
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
  /** The survey to display */
  @Input() survey!: SurveyModel;
  /** The next survey to display */
  @Input() surveyNext?: SurveyModel;
  /** Whether the survey is active */
  @Input() surveyActive = true;
  /** List of used locales for the survey */
  public usedLocalesSurvey: LangObject[] = [];
  /** Current locale of the survey */
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
    if (this.surveyNext) {
      this.surveyNext.locale = langItem.code;
    }
    this.currentLocaleSurvey = langItem;
    localStorage.setItem('surveyLang', langItem.code);
  }
}
