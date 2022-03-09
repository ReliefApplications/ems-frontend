import {
  APP_INITIALIZER,
  DoBootstrap,
  Injector,
  NgModule,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
// Apollo
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { AppComponent } from './app.component';
import { NewsComponent } from './news/news.component';
import { ApplicationWidgetComponent } from './widgets/application-widget/application-widget.component';
import { ApplicationWidgetModule } from './widgets/application-widget/application-widget.module';
import { DashboardWidgetComponent } from './widgets/dashboard-widget/dashboard-widget.component';
import { DashboardWidgetModule } from './widgets/dashboard-widget/dashboard-widget.module';
import { FormWidgetComponent } from './widgets/form-widget/form-widget.component';
import { FormWidgetModule } from './widgets/form-widget/form-widget.module';
import { WorkflowWidgetComponent } from './widgets/workflow-widget/workflow-widget.component';
import { WorkflowWidgetModule } from './widgets/workflow-widget/workflow-widget.module';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

localStorage.setItem('loaded', 'false');

const REFRESH = new BehaviorSubject<boolean>(false);

/**
 * Configuration of the Apollo client.
 *
 * @param httpLink Apollo http link
 * @returns void
 */
export const provideApollo = (httpLink: HttpLink): any => {
  const basic = setContext((operation, context) => ({
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext((operation, context) => {
    // Get the authentication token from local storage if it exists
    // const token = localStorage.getItem('idtoken');
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxcVFRZElCNzFxaFpWbDBiSXo5OFd2R1VqaHk3TlR5Q1g1U3ZPRVhya29jIn0.eyJleHAiOjE2NDY4NDAzOTIsImlhdCI6MTY0Njg0MDA5MiwiYXV0aF90aW1lIjoxNjQ2ODM2MDAwLCJqdGkiOiI2ZjY0ZGVkZS0yZmE2LTQ1YjMtOWM0Ni02MTg4ODdhYTkwOGIiLCJpc3MiOiJodHRwczovL2lkLWRldi5vb3J0Y2xvdWQudGVjaC9hdXRoL3JlYWxtcy9vb3J0IiwiYXVkIjoib29ydC1jbGllbnQiLCJzdWIiOiJjMmY3MDlkMy1iNzMwLTQ0N2EtYWExZi05M2I3MjU4MmQwNWMiLCJ0eXAiOiJJRCIsImF6cCI6Im9vcnQtY2xpZW50Iiwibm9uY2UiOiJkRFoxU21GemJXVjRTSFpoUVMxaFVIbDNTWEkwTjJSRmVrVmlSV3RmVWpOSmNHZGllVEYtYkRKNFozbDEiLCJzZXNzaW9uX3N0YXRlIjoiOWM4ODA5YmUtYTM2Ny00Y2U4LWI2NGYtMDg1YjRkYjY1OTc5IiwiYXRfaGFzaCI6InVNZ1ZPelMtZXdGTjUxb2JpeDZzX0EiLCJhY3IiOiIxIiwic2lkIjoiOWM4ODA5YmUtYTM2Ny00Y2U4LWI2NGYtMDg1YjRkYjY1OTc5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiQW50b2luZSBIdXJhcmQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbnRvaW5lQHJlbGllZmFwcGxpY2F0aW9ucy5vcmciLCJnaXZlbl9uYW1lIjoiQW50b2luZSIsImZhbWlseV9uYW1lIjoiSHVyYXJkIiwiZW1haWwiOiJhbnRvaW5lQHJlbGllZmFwcGxpY2F0aW9ucy5vcmcifQ.PSy4N4g9R-mEa8PHKE8zTT2W9Lh2LE5IBLRn-977teRc1RANjhIVLaMyECOFTLQrOOnXAAPqTf5myYt6gNEbmub1t1pfID3NVpBg1sbNiBxjcim2_rCLpnl0zpwoU6TXd5zNFXl1mFyzY7sVU4ukmodUGz5YjGcgxN8MHcwRwRRJ5WU1oix-JQkiElKBflC5RtJidbE2HeMDLqzmFn7fwKx2-g8FYWDBjC-Y5U184SDjYmD9TOZR9K6rT5_GcuulDOR8_OGQzbd_NAToUZ5igf4WbO_tzVacFbAXgBtEFFPOVm90ra1LrEYcl28WCm_lTCcLqC-_CQNuWGroS4_8gA';
    return {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const http = httpLink.create({ uri: `${environment.apiUrl}/graphql` });

  const ws = new WebSocketLink({
    uri: `${environment.subscriptionApiUrl}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem('idtoken'),
      },
      connectionCallback: (error) => {
        if (localStorage.getItem('loaded') === 'true') {
          // location.reload();
          REFRESH.next(true);
          localStorage.setItem('loaded', 'false');
        }
        localStorage.setItem('loaded', 'true');
      },
    },
  });

  interface Definition {
    kind: string;
    operation?: string;
  }

  const link = ApolloLink.from([
    basic,
    auth,
    split(
      ({ query }) => {
        const { kind, operation }: Definition = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http
    ),
  ]);

  // Cache is not currently used, due to fetchPolicy values
  const cache = new InMemoryCache();

  return {
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  };
};

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

@NgModule({
  declarations: [AppComponent, NewsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    RouterModule.forRoot([]),
    OAuthModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    DashboardWidgetModule,
    FormWidgetModule,
    WorkflowWidgetModule,
    ApplicationWidgetModule,
  ],
  providers: [
    {
      provide: 'environment',
      useValue: environment,
    },
    {
      // TODO: added default options to solve cache issues, cache solution can be added at the query / mutation level.
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      multi: true,
      deps: [OAuthService],
    },
  ],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector, private translate: TranslateService) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang('en');
  }

  ngDoBootstrap(): void {
    // Dashboard
    const dashboard = createCustomElement(DashboardWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('dashboard-widget', dashboard);
    // Form
    const form = createCustomElement(FormWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('form-widget', form);
    // Workflow
    const workflow = createCustomElement(WorkflowWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('workflow-widget', workflow);
    // Application
    const application = createCustomElement(ApplicationWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('application-widget', application);
  }
}
