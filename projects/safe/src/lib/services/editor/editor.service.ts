import { Inject, Injectable } from '@angular/core';
import { EDITOR_LANGUAGE_PAIRS } from '../../const/tinymce.const';
import { TranslateService } from '@ngx-translate/core';

/**
 * Shared editor service
 * Editor service is used to get main url and current language
 */
@Injectable({
  providedIn: 'root',
})
export class SafeEditorService {
  /** environment variable */
  private environment: any;

  /**
   * Compute the base url based on the environment file
   *
   * @returns the base url
   */
  get url(): string {
    let url: string;
    if (this.environment.module === 'backoffice') {
      url = new URL(this.environment.backOfficeUri).pathname;
    } else {
      url = new URL(this.environment.frontOfficeUri).pathname;
    }
    let base_url: string;
    if (url !== '/') {
      base_url = url.slice(0, -1) + '/tinymce';
    } else {
      base_url = '/tinymce';
    }
    return base_url;
  }

  /**
   * Compute the current language
   *
   * @returns the current language
   */
  get language(): string {
    const lang = this.translate.currentLang;
    const editorLang = EDITOR_LANGUAGE_PAIRS.find((x) => x.key === lang);
    let language: string;
    if (editorLang) {
      language = editorLang.tinymceKey;
    } else {
      language = 'en';
    }
    return language;
  }

  /**
   * Configuration component for editor service
   *
   * @param environment Environment file used to get main url of the page
   * @param translate Angular Translate Service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    this.environment = environment;
  }
}
