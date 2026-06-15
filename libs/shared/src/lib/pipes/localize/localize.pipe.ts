import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  LocalizedString,
  resolveLocalizedString,
} from '../../models/localized-string.model';

/**
 * Resolves a `LocalizedString` against the current UI language.
 *
 * Accepts either a plain string (returned as-is) or a per-locale map and picks
 * the active language, falling back to English, then to the first non-empty
 * entry. `pure: false` so it re-renders on language change.
 */
@Pipe({
  name: 'sharedLocalize',
  pure: false,
  standalone: true,
})
export class LocalizePipe implements PipeTransform {
  /**
   * Creates the pipe, wiring the translate service used to resolve the
   * active language at transform time.
   *
   * @param translate ngx-translate service, source of the active language.
   */
  constructor(private translate: TranslateService) {}

  /**
   * Resolves a localized string against the current UI language.
   *
   * @param value Plain string or per-locale map.
   * @returns Resolved string for the active language, or empty string.
   */
  transform(value: LocalizedString | null | undefined): string {
    return resolveLocalizedString(value, this.translate.currentLang);
  }
}
