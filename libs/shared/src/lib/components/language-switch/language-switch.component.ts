import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  IconModule,
  MenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { takeUntil } from 'rxjs/operators';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { getLanguageName, getLanguageNativeName } from '../../utils/languages';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

/** Language option displayed in the switcher. */
interface LanguageOption {
  /** Language code. */
  code: string;
  /** Language name in the active language. */
  currentName: string;
  /** Language native name. */
  nativeName: string;
}

/**
 * Header language switcher. Lets the user change the active interface language
 * and reloads the page so all translated content is re-initialized.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    IconModule,
    MenuModule,
    TooltipModule,
  ],
  selector: 'shared-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss'],
})
export class LanguageSwitchComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /**
   * Restricts the languages shown in the switcher to this list (plus the
   * default language, which is always available). When not set (null), all
   * system languages are shown - this is the back-office behavior, where
   * every language must always remain selectable.
   */
  @Input() allowedLanguages: string[] | null = null;
  /** All languages known to the system (unfiltered). */
  private allLanguages: string[] = [];
  /** Languages available, after applying the allowedLanguages restriction */
  public languages: string[] = [];
  /** Current active language. */
  public currentLanguage = '';
  /** Other available languages shown in the switcher. */
  public languageOptions: LanguageOption[] = [];

  /**
   * Header language switcher.
   *
   * @param translate This is the Angular service that translates text
   * @param dateTranslate Service used for date formatting
   */
  constructor(
    private translate: TranslateService,
    private dateTranslate: DateTranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.allLanguages = this.translate.getLangs();
    this.updateLanguages();
    this.setCurrentLanguage(
      this.translate.currentLang || this.translate.defaultLang
    );
    // Keep the switcher in sync when the language is changed elsewhere
    // (e.g. from the preferences modal).
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ lang }) => this.setCurrentLanguage(lang));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // allowedLanguages can resolve asynchronously (e.g. once the current
    // application or form has finished loading), so re-derive the list
    // whenever it changes after the initial binding.
    if (
      changes['allowedLanguages'] &&
      !changes['allowedLanguages'].firstChange
    ) {
      this.updateLanguages();
      this.setCurrentLanguage(this.currentLanguage);
    }
  }

  /**
   * Recomputes the selectable language list from allLanguages, applying the
   * allowedLanguages restriction when set. The default language is always
   * kept available.
   */
  private updateLanguages(): void {
    if (this.allowedLanguages) {
      const defaultLang = this.translate.defaultLang;
      this.languages = this.allLanguages.filter(
        (code) => code === defaultLang || this.allowedLanguages?.includes(code)
      );
    } else {
      this.languages = this.allLanguages;
    }
  }

  /**
   * Gets the display name of the active language.
   *
   * @returns Language native name
   */
  get currentLanguageName(): string {
    return getLanguageNativeName(this.currentLanguage);
  }

  /**
   * Changes current active language from the switcher and reloads the page.
   *
   * @param language id of the language.
   */
  onSelectLanguage(language: string): void {
    this.setLanguage(language);
    this.reloadPage();
  }

  /**
   * Changes current active language.
   *
   * @param language id of the language.
   */
  setLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('lang', language);
    this.setCurrentLanguage(language);
    if (!localStorage.getItem('date-lang')) {
      this.dateTranslate.use(language, false);
    }
  }

  /**
   * Reloads the current page so all translated content is initialized again.
   */
  reloadPage(): void {
    window.location.reload();
  }

  /**
   * Updates the active language and rebuilds the selectable language list.
   *
   * @param language Active language id
   */
  private setCurrentLanguage(language: string): void {
    this.currentLanguage = language;
    this.languageOptions = this.languages
      .filter((code: string) => code !== language)
      .map((code: string) => ({
        code,
        currentName: getLanguageName(code, this.translate),
        nativeName: getLanguageNativeName(code),
      }));
  }
}
