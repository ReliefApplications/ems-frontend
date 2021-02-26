import { ElementRef, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { WhoWidgetGridModule } from '@who-ems/builder';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Apollo
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';

// Env
import { environment } from '../environments/environment';

// MSAL
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { MatSidenavModule } from '@angular/material/sidenav';

localStorage.setItem('loaded', 'false');

/*  Configuration of the Apollo client.
*/
export function provideApollo(httpLink: HttpLink): any {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));


  const auth = setContext((operation, context) => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem('msal.idtoken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  });

  const http = httpLink.create({ uri: `${environment.API_URL}/graphql` });

  const ws = new WebSocketLink({
    uri: `${environment.SUBSCRIPTION_API_URL}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem('msal.idtoken')
      },
      connectionCallback: (error) => {
        if (localStorage.getItem('loaded') === 'true') {
          localStorage.setItem('loaded', 'false');
        }
        localStorage.setItem('loaded', 'true');
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
}

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    BrowserModule,
    WhoWidgetGridModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApolloModule,
    MatSnackBarModule,
    HttpLinkModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
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
      provide: POPUP_CONTAINER,
      useFactory: () => {
        //return the container ElementRef, where the popup will be injected
        return { nativeElement: document.body } as ElementRef;
      }
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MsalInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: []
})
export class AppModule {
  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap(): void {
    // const whoWidgetGrid = createCustomElement(WhoWidgetGridComponent, { injector: this.injector });

    // customElements.define('who-widget-grid', whoWidgetGrid);

    const whoDashboard = createCustomElement(DashboardComponent, { injector: this.injector });

    customElements.define('who-dashboard', whoDashboard);
  }
}
