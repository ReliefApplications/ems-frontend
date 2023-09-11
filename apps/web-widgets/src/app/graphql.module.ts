import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { environment } from '../environments/environment';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';

/**
 * Configuration of the Apollo client.
 *
 * @param httpLink Apollo http link
 * @returns void
 */
export const createApollo = (httpLink: HttpLink): ApolloClientOptions<any> => {
  const basic = setContext(() => ({
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'charset=utf-8',
      UserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  }));

  const auth = setContext(() => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem('idtoken');
    return {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const http = httpLink.create({
    uri: `${environment.apiUrl}/graphql`,
    extractFiles: (body) => extractFiles(body, isExtractableFile),
  });

  const ws = new WebSocketLink({
    uri: `${environment.subscriptionApiUrl}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem('idtoken'),
      },
      connectionCallback: () => {
        // if (localStorage.getItem('loaded') === 'true') {
        //   // location.reload();
        //   localStorage.setItem('loaded', 'false');
        // }
        // localStorage.setItem('loaded', 'true');
      },
    },
  });

  /** Definition for apollo link query definitino */
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

/**
 * GraphQL Module.
 */
@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
