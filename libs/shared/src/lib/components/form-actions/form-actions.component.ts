import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SurveyModel, surveyLocalization } from 'survey-core';
import { Subject, takeUntil } from 'rxjs';
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
export class FormActionsComponent implements OnInit, OnDestroy {
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
  /** Destroy subject */
  private destroy$ = new Subject<void>();

  /**
   * Component for the language selection dropdown for surveys.
   *
   * @param translate Angular translate service
   */
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // set the available languages and default language of the survey
    this.usedLocalesSurvey = this.getUsedLocales();
    this.setSurveyLocaleFromAppLanguage(
      this.translate.currentLang || this.translate.defaultLang
    );
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ lang }) => this.setSurveyLocaleFromAppLanguage(lang));
    this.setCurrentLocale();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Gets the list of locales used by the survey.
   *
   * @returns List of locales used by the survey.
   */
  private getUsedLocales(): LangObject[] {
    const locales = this.survey?.getUsedLocales() || [];
    const usedLocales = locales.map((lang) => ({
      code: lang,
      nativeName: getLanguageNativeName(lang),
    }));
    return usedLocales.some((lang) => lang.code === DEFAULT_LOCALE_SURVEY.code)
      ? usedLocales
      : [DEFAULT_LOCALE_SURVEY, ...usedLocales];
  }

  /**
   * Sets the survey locale from the active application language.
   *
   * @param lang Active application language.
   */
  private setSurveyLocaleFromAppLanguage(lang: string): void {
    if (!this.survey) return;

    const locale = this.getSupportedSurveyLocale(lang);
    if (locale !== undefined) {
      this.survey.locale = locale;
      if (this.surveyNext) {
        this.surveyNext.locale = locale;
      }
      localStorage.setItem('surveyLang', locale);
      this.setCurrentLocale();
    }
  }

  /**
   * Gets the survey locale matching a language code.
   *
   * @param lang Application language.
   * @returns Survey locale, if supported.
   */
  private getSupportedSurveyLocale(lang: string): string | undefined {
    const locales = this.survey?.getUsedLocales() || [];
    const baseLanguage = lang?.split('-')[0];
    if (locales.includes(lang)) return lang;
    if (locales.includes(baseLanguage)) return baseLanguage;
    if (
      lang === DEFAULT_LOCALE_SURVEY.code ||
      baseLanguage === DEFAULT_LOCALE_SURVEY.code
    ) {
      return DEFAULT_LOCALE_SURVEY.code;
    }
    return undefined;
  }

  /** Sets the selected survey locale in the language dropdown. */
  private setCurrentLocale(): void {
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
