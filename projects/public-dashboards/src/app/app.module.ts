import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Apollo
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

// Env
import { environment } from '../environments/environment';

// Config
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';

// TRANSLATOR
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from '@progress/kendo-angular-l10n';
import { KendoTranslationService } from '@safe/builder';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

// Register local translations for dates
registerLocaleData(localeFr);
registerLocaleData(localeEn);

// Kendo datepicker for surveyjs
import {
  CalendarDOMService,
  CenturyViewService,
  DecadeViewService,
  HoursService,
  MinutesService,
  MonthViewService,
  TimePickerDOMService,
  TOUCH_ENABLED,
  YearViewService,
} from '@progress/kendo-angular-dateinputs';
import { PopupService } from '@progress/kendo-angular-popup';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import { touchEnabled } from '@progress/kendo-common';
import { OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';

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
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OAuthModule.forRoot(),
  ],
  providers: [
    {
      provide: 'environment',
      useValue: environment,
    },
    {
      provide: MessageService,
      useClass: KendoTranslationService,
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: (httpLink: HttpLink): NamedOptions => {
        return {
          default: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.apiUrl,
            }),
          },
        };
      },
      deps: [HttpLink],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (oauth: OAuthService): any =>
      () => {
        oauth.configure(environment.authConfig);
      },
      multi: true,
      deps: [OAuthService],
    },
    {
      provide: OAuthStorage,
      useValue: localStorage,
    },
    {
      provide: TOUCH_ENABLED,
      useValue: [touchEnabled],
    },
    PopupService,
    ResizeBatchService,
    CalendarDOMService,
    TimePickerDOMService,
    MonthViewService,
    HoursService,
    MinutesService,
    YearViewService,
    DecadeViewService,
    CenturyViewService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  /**
   * Main module of Front-Office project.
   */
  constructor() {}
}
