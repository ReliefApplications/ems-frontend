import { ElementRef, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { SafeWidgetGridModule } from '@safe/builder';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Apollo
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

// Env
import { environment } from '../environments/environment';

// MSAL
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

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
  declarations: [DashboardComponent, AppComponent],
  imports: [
    BrowserModule,
    SafeWidgetGridModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSidenavModule
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap(): void {
    // const safeWidgetGrid = createCustomElement(SafeWidgetGridComponent, { injector: this.injector });

    // customElements.define('safe-widget-grid', SafeWidgetGrid);

    const safeDashboard = createCustomElement(DashboardComponent, { injector: this.injector });

    customElements.define('safe-dashboard', safeDashboard);
  }
}
