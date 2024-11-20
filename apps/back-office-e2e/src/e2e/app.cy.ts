import { CommonModule } from '@angular/common';
import {
  EditorComponent,
  HtmlWidgetContentModule,
} from '@oort-front/shared/widgets';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
  new TranslateHttpLoader(http);
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
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param translateService The translate service that will be used to translate the text.
   */
  constructor(translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
}

describe('back-office', () => {
  // beforeEach(() => {
  //   cy.visit('/applications/1');
  // });
  cy.intercept('POST', Cypress.env('graphql'), (req) => {
    if (req.body.operationName === 'operationName') {
      req.reply({ fixture: 'mockData.json' });
    }
  });
  it('should render component welcome message', () => {
    cy.mount(EditorComponent, {
      declarations: [EditorComponent],
      imports: [
        CommonModule,
        ButtonModule,
        StorybookTranslateModule,
        HtmlWidgetContentModule,
        SpinnerModule,
      ],
    });
  });
});
