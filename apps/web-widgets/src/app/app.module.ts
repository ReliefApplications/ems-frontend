import {
  APP_INITIALIZER,
  ApplicationRef,
  DoBootstrap,
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
import { DateTimePickerModule } from '@progress/kendo-angular-dateinputs';

import {
  AppAbility,
  KendoTranslationService,
  SafeAuthInterceptorService,
  SafeFormService,
} from '@oort-front/safe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
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

/**
 * Initialize authentication in the platform.
 * Configuration in environment file.
 * Use oAuth
 *
 * @param oauth OAuth Service
 * @param translate Translate service
 * @param injector Injector
 * @returns oAuth configuration and translation content loaded
 */
const initializeAuthAndTranslations =
  (
    oauth: OAuthService,
    translate: TranslateService,
    injector: Injector
  ): (() => Promise<any>) =>
  () => {
    oauth.configure(environment.authConfig);
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
            // console.log(translate.instant('kendo.datetimepicker.now'));
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
  new AppOverlayContainer(_platform);

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
    DateTimePickerModule,
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
      deps: [OAuthService],
    },
    {
      provide: POPUP_CONTAINER,
      useFactory: () =>
        // return the container ElementRef, where the popup will be injected
        ({ nativeElement: document.body } as ElementRef),
    },
    {
      provide: POPUP_CONTAINER,
      useFactory: () =>
        // return the container ElementRef, where the popup will be injected
        ({ nativeElement: document.body } as ElementRef),
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
      useClass: SafeAuthInterceptorService,
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
    PopupService,
    ResizeBatchService,
  ],
})
export class AppModule implements DoBootstrap {
  /**
   * Main project root module
   *
   * @param injector Angular injector
   * @param formService SafeFormService
   */
  constructor(private injector: Injector, private translate: TranslateService) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
  }

  ngDoBootstrap(appRef: ApplicationRef): void {
    const form = createCustomElement(FormWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('form-widget', form);
  }
}
