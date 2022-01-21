import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const CONFIG = undefined;

/**
  A utility module adding I18N support for Storybook stories
 **/


  /**
   * Sets up translator.
   *
   * @param http http client
   * @returns Translator.
   */
  export const httpTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http);
  @NgModule({
    imports: [
      HttpClientModule,
      TranslateModule.forRoot(
      {
        loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }
      ), TranslateModule],
  })
  export class StorybookTranslateModule {
    constructor(translateService: TranslateService) {
      console.log('Configuring the translation service: ', translateService);
      console.log('Translations: ', translateService.translations);
      translateService.setDefaultLang('en');
      translateService.use('en');
    }
  }
