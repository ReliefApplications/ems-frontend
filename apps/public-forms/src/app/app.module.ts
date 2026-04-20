import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Apollo / GraphQL
import { GraphQLModule } from './graphql.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FormService } from '@oort-front/shared';

// Config
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

// TRANSLATOR
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc/public_api';
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
    OAuthModule.forRoot(),
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
      deps: [OAuthService,FormService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
