import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Apollo / GraphQL
import { GraphQLModule } from './graphql.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService, DatePipe, FormService, LayoutModule } from '@oort-front/shared';

// Config
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

// TRANSLATOR
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PopupService } from '@progress/kendo-angular-popup';
import { IconsService } from '@progress/kendo-angular-icons';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { AppAbility, PublicAuthService } from './public-auth-service/public-auth.service';
import { PureAbility } from '@casl/ability';

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
  (formService: FormService): any =>
  () => {
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
  new TranslateHttpLoader(
    http,
    `${environment.frontOfficeUri}assets/i18n/`,
    '.json'
  );

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    DialogCdkModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DialogCdkModule,
    DateInputsModule,
    LayoutModule,
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
      deps: [FormService],
    },
    PopupService,
    IconsService,
    DatePipe,
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    { provide: AuthService, useClass: PublicAuthService },
    {
      provide: AppAbility,
      useValue: new AppAbility(),
    },
    {
      provide: PureAbility,
      useExisting: AppAbility,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  /**
   * Main module of Back-Office project.
   *
   * @param translate Angular translate service
   */
  constructor(private translate: TranslateService) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
  }
}
