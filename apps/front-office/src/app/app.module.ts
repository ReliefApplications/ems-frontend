import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Http
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

// Env
import { environment } from '../environments/environment';

// Config
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

// TRANSLATOR
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { MessageService } from '@progress/kendo-angular-l10n';
import {
  AppAbility,
  KendoTranslationService,
  AuthInterceptorService,
  FormService,
} from '@oort-front/shared';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

/** CASL */
import { PureAbility } from '@casl/ability';

// Register local translations for dates
registerLocaleData(localeFr);
registerLocaleData(localeEn);

import { PopupService } from '@progress/kendo-angular-popup';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import { IconsService } from '@progress/kendo-angular-icons';
// import { touchEnabled } from '@progress/kendo-common';
// Apollo / GraphQL
import { GraphQLModule } from './graphql.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

// Fullscreen
import {
  OverlayContainer,
  FullscreenOverlayContainer,
} from '@angular/cdk/overlay';

// Sentry
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular-ivy';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

/**
 * Initialize application.
 * Setup oAuth configuration.
 * Initialize form builder.
 *
 * @param oauth OAuth Service
 * @param formService Shared form service
 * @returns oAuth configuration
 */
const initializeApp =
  (oauth: OAuthService, formService: FormService): any =>
  () => {
    oauth.configure(environment.authConfig);
    formService.initialize();
    // Add fa icon font to check in the application
    library.add(fas, fab);
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
 * Main module of Front-Office project.
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DialogCdkModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OAuthModule.forRoot(),
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
      useFactory: initializeApp,
      multi: true,
      deps: [OAuthService, FormService],
    },
    {
      provide: MessageService,
      useClass: KendoTranslationService,
    },
    {
      provide: OAuthStorage,
      useValue: localStorage,
    },
    // TODO: check
    // {
    //   provide: TOUCH_ENABLED,
    //   useValue: [touchEnabled],
    // },
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
    PopupService,
    ResizeBatchService,
    IconsService,
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    // Sentry
    ...(environment.sentry
      ? [
          {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
              showDialog: false,
            }),
          },
          {
            provide: Sentry.TraceService,
            deps: [Router],
          },
          {
            provide: APP_INITIALIZER,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            useFactory: () => () => {},
            deps: [Sentry.TraceService],
            multi: true,
          },
        ]
      : []),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
