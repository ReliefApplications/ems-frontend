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
import { extractFiles } from 'extract-files';
import get from 'lodash/get';

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
    },
  }));

  const http = httpLink.create({
    uri: `${environment.apiUrl}/graphql`,
    extractFiles,
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
    split(
      ({ query }) => {
        const { kind, operation }: Definition = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http
    ),
  ]);

  const connectionMerge = (existing: any, incoming: any, options?: any) => {
    console.log('Merging ...');
    console.log(get(existing, 'edges.length', 0));
    console.log(get(incoming, 'edges.length', 0));
    console.log(options);
    return {
      edges: [...get(existing, 'edges', []), ...get(incoming, 'edges', [])],
      pageInfo: get(incoming, 'pageInfo'),
      totalCount: get(incoming, 'totalCount', 0),
    };
  };

  // Cache is not currently used, due to fetchPolicy values
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          applications: {
            keyArgs: false,
            merge: (existing: any, incoming: any, options) =>
              connectionMerge(existing, incoming, options),
          },
          forms: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          resources: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          apiConfigurations: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          pullJobs: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          referenceDatas: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          notifications: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
        },
      },
      Resource: {
        fields: {
          records: {
            keyArgs: false,
            merge: (existing: any, incoming: any, options) =>
              connectionMerge(existing, incoming, options),
          },
          layouts: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          aggregations: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
        },
      },
      Form: {
        fields: {
          records: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
        },
      },
      Application: {
        fields: {
          users: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
          customNotifications: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
        },
      },
      Role: {
        fields: {
          users: {
            keyArgs: false,
            merge: (existing: any, incoming: any) =>
              connectionMerge(existing, incoming),
          },
        },
      },
    },
  });

  return {
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        // prevent cache issue to happen
        fetchPolicy: 'no-cache',
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
