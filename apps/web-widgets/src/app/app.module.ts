import {
  APP_INITIALIZER,
  DoBootstrap,
  ElementRef,
  Injector,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Http
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormWidgetModule } from './widgets/form-widget/form-widget.module';
import { environment } from '../environments/environment';
import { OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from '@progress/kendo-angular-l10n';
import {
  AppAbility,
  KendoTranslationService,
  AuthInterceptorService,
  FormService,
} from '@oort-front/shared';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { AppOverlayContainer } from './utils/overlay-container';
// Apollo / GraphQL
import { GraphQLModule } from './graphql.module';
import { PureAbility } from '@casl/ability';
// Config
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { createCustomElement } from '@angular/elements';
import { FormWidgetComponent } from './widgets/form-widget/form-widget.component';
import { POPUP_CONTAINER, PopupService } from '@progress/kendo-angular-popup';
import { LOCATION_INITIALIZED } from '@angular/common';
import { ResizeBatchService } from '@progress/kendo-angular-common';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

// Register local translations for dates
registerLocaleData(localeFr);
registerLocaleData(localeEn);

/**
 * Initialize authentication in the platform.
 * Configuration in environment file.
 * Use oAuth
 *
 * @param oauth OAuth Service
 * @param translate Translate service
 * @param injector Injector
 * @param {FormService} formService Form service containing initialize for survey features
 * @returns oAuth configuration and translation content loaded
 */
const initializeAuthAndTranslations =
  (
    oauth: OAuthService,
    translate: TranslateService,
    injector: Injector,
    formService: FormService
  ): (() => Promise<any>) =>
  () => {
    // todo: check if used or not
    oauth.configure(environment.authConfig);
    formService.initialize();
    // Add fa icon font to check in the application
    // Make sure that all translations are available before the app initializes
    return new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null)
      );
      locationInitialized.then(() => {
        translate.addLangs(environment.availableLanguages);
        translate.setDefaultLang(environment.availableLanguages[0]);
        translate.use(environment.availableLanguages[0]).subscribe({
          next: () => {
            console.log(
              `Successfully initialized '${environment.availableLanguages[0]}' language.'`
            );
          },
          error: () => {
            console.error(
              `Problem with '${environment.availableLanguages[0]}' language initialization.'`
            );
          },
          complete: () => {
            resolve(null);
          },
        });
      });
    });
  };
/**
 * Sets up translator.
 *
 * @param http http client
 * @returns Translator.
 */
export const httpTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http);

/**
 * Provides custom overlay to inject modals / snackbars in shadow root.
 *
 * @param _platform CDK platform.
 * @returns custom Overlay container.
 */
const provideOverlay = (_platform: Platform): AppOverlayContainer =>
  new AppOverlayContainer(_platform, document);

/**
 * Web Widget project root module.
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    DialogCdkModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OverlayModule,
    FormWidgetModule,
    GraphQLModule,
    DateInputsModule,
  ],
  providers: [
    {
      provide: 'environment',
      useValue: environment,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuthAndTranslations,
      multi: true,
      deps: [OAuthService, TranslateService, Injector, FormService],
    },
    {
      provide: OverlayContainer,
      useFactory: provideOverlay,
      deps: [Platform],
    },
    {
      provide: MessageService,
      useClass: KendoTranslationService,
    },
    {
      provide: OAuthStorage,
      useValue: localStorage,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: AppAbility,
      useValue: new AppAbility(),
    },
    {
      provide: PureAbility,
      useExisting: AppAbility,
    },
    {
      provide: POPUP_CONTAINER,
      useFactory: () => {
        return {
          nativeElement: document.body,
        } as ElementRef;
      },
    },
    PopupService,
    ResizeBatchService,
  ],
})
export class AppModule implements DoBootstrap {
  /**
   * Main project root module
   *
   * @param injector Angular injector
   */
  constructor(private injector: Injector) {}

  /**
   * Bootstrap the project.
   * Create the web elements.
   */
  ngDoBootstrap(): void {
    // Form
    const form = createCustomElement(FormWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('form-widget', form);

    const fonts = [
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
      'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0',
    ];
    // Make sure that the needed fonts are always available wherever the web component is placed
    fonts.forEach((font) => {
      const link = document.createElement('link');
      link.href = font;
      link.rel = 'stylesheet';
      // Add them at the beginning of the head element in order to not interfere with any font of the same type
      document.head.prepend(link);
    });
  }
}
