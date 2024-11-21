/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { SpinnerModule } from '@oort-front/ui';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Sets up translator.
 *
 * @param http http client
 * @returns Translator.
 */
export const httpTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, `assets/i18n/`, '.json');
/**
 * A utility module adding I18N support for Storybook stories
 */
@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    TranslateModule,
  ],
})
class StorybookTranslateModule {
  /**
   * Constructor
   *
   * @param translateService The translate service that will be used to translate the text.
   */
  constructor(translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
}

@Component({
  standalone: true,
  imports: [
    // CommonModule,
    // ButtonModule,
    StorybookTranslateModule,
    // HtmlWidgetContentModule,
    SpinnerModule,
  ],
  template: `<ui-spinner></ui-spinner>`,
})
class WrapperComponent {}

describe('back-office', () => {
  it('should render component welcome message', () => {
    cy.mount(WrapperComponent, {
      imports: [WrapperComponent],
    });
  });
});
