import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const CONFIG = undefined;

/**
  A utility module adding I18N support for Storybook stories
 **/
  @NgModule({
    imports: [TranslateModule.forRoot(CONFIG), TranslateModule],
  })
  export class StorybookTranslateModule {
    constructor(translateService: TranslateService) {
      console.log('Configuring the translation service: ', translateService);
      console.log('Translations: ', translateService.translations);
      translateService.setDefaultLang('en');
      translateService.use('en');
    }
  }
