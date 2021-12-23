import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Apollo
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

// Env
import { environment } from '../environments/environment';

// MSAL
import {
  MsalInterceptor, MsalBroadcastService, MsalGuard, MsalGuardConfiguration,
  MsalInterceptorConfiguration, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-common';

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
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem('msal.idtoken');
    return {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`
      }
    };
  });
  const http = httpLink.create({ uri: `${environment.apiUrl}/graphql` });

  const ws = new WebSocketLink({
    uri: `${environment.subscriptionApiUrl}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem('msal.idtoken')
      }
    }
  });

  interface Definition {
    kind: string;
    operation?: string;
  }

  const link = ApolloLink.from([basic, auth, split(
    ({ query }) => {
      const { kind, operation }: Definition = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    http,
  )]);
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
      }
    }
  };
};

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

/**
 * Logger for dev purpose.
 *
 * @param logLevel MSAL log level.
 * @param message MSAL message.
 */
export const loggerCallback = (logLevel: LogLevel, message: string): void => {
  console.log(message);
};

/**
 * Configures MSAL instance.
 *
 * @returns MSAL Client Application.
 */
export const msalInstanceFactory = (): IPublicClientApplication => new PublicClientApplication({
  auth: {
    clientId: environment.clientId,
    authority: environment.authority,
    redirectUri: environment.redirectUrl,
    postLogoutRedirectUri: environment.postLogoutRedirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
  },
  system: {
    loggerOptions: {
      // Can be enabled for dev purpose
      // loggerCallback,
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false
    }
  }
});

/**
 * Configures MSAL interceptor.
 *
 * @returns MSAL interceptor configuration.
 */
export const msalInterceptorConfigFactory = (): MsalInterceptorConfiguration => {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(`${environment.apiUrl}/*`, [`${environment.clientId}/.default`]);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
};

/**
 * Configures MSAL guard.
 *
 * @returns MSAL guard configuration.
 */
export const msalGuardConfigFactory = (): MsalGuardConfiguration => ({
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read', 'openid', 'profile']
    },
    loginFailedRoute: '/auth'
  });

@NgModule({
  declarations: [
    AppComponent
  ],
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
    MatDialogModule
  ],
  providers: [
    {
      provide: 'environment',
      useValue: environment
    },
    {
      // TODO: added default options to solve cache issues, cache solution can be added at the query / mutation level.
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: msalGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: msalInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
