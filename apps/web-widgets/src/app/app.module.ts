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
import { AppComponent } from './app.component';
import { FormWidgetModule } from './widgets/form-widget/form-widget.module';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
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
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';

/**
 * Initialize authentication in the platform.
 * Configuration in environment file.
 * Use oAuth
 *
 * @param oauth OAuth Service
 * @returns oAuth configuration
 */
const initializeAuth =
  (oauth: OAuthService): any =>
  () => {
    oauth.configure(environment.authConfig);
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
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
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
  ],
  providers: [
    {
      provide: 'environment',
      useValue: environment,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      multi: true,
      deps: [OAuthService],
    },
    {
      provide: POPUP_CONTAINER,
      useFactory: () => {
        const currentPopupHolder: any = Array.from(
          document.getElementsByTagName('*')
        ).filter((element) => element.shadowRoot);

        // REACTIVE CODE, WOULD IT WORK?? //
        // Callback function to execute when mutations are observed
        // const updatePopupHolder = (mutationList: any) => {
        //   for (const mutation of mutationList) {
        //     if (mutation.type === 'childList') {
        //       currentPopupHolder = Array.from(
        //         document.getElementsByTagName('*')
        //       ).filter((element) => element.shadowRoot);
        //     }
        //   }
        // };

        // // Create an observer instance linked to the updatePopupHolder function
        // const observer = new MutationObserver(updatePopupHolder);
        // // Start observing the target node for configured mutations
        // observer.observe(document.body, {
        //   attributes: false,
        //   childList: true,
        //   subtree: true,
        // });

        // return the container ElementRef, where the popup will be injected
        return {
          nativeElement: currentPopupHolder
            ? currentPopupHolder[0].shadowRoot
            : document.body,
        } as ElementRef;
      },
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
  ],
})
export class AppModule implements DoBootstrap {
  /**
   * Main project root module
   *
   * @param injector Angular injector
   * @param translate Angular translate service
   */
  constructor(
    private injector: Injector,
    private translate: TranslateService,
    private formService: SafeFormService
  ) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
  }

  ngDoBootstrap(): void {
    const form = createCustomElement(FormWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('form-widget', form);
  }
}
