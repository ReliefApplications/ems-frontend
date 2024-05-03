import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  // ApolloLink,
  InMemoryCache,
  // split,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
// import { setContext } from '@apollo/client/link/context';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { environment } from '../environments/environment';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { createClient } from 'graphql-ws';
// import { SchemaService } from '@oort-front/shared';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

/**
 * Configuration of the Apollo client.
 *
 * @param httpLink Apollo http link
 * @param httpClient Http client
 * @returns void
 */
export const createApollo = async (
  httpLink: HttpLink,
  httpClient: HttpClient
): Promise<ApolloClientOptions<any>> => {
  // const basic = setContext(() => ({
  //   headers: {
  //     // eslint-disable-next-line @typescript-eslint/naming-convention
  //     Accept: 'application/json; charset=utf-8',
  //     UserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //   },
  // }));

  const schemaUrl = await firstValueFrom(
    httpClient
      .get<{ url: string }>('/schema/url')
      .pipe(map((response) => response.url))
  );

  const http = httpLink.create({
    uri: schemaUrl,
    extractFiles: (body) => extractFiles(body, isExtractableFile),
  });

  // const ws = new GraphQLWsLink(
  //   createClient({
  //     url: `${environment.subscriptionApiUrl}/graphql`,
  //     connectionParams: {
  //       authToken: localStorage.getItem('idtoken'),
  //     },
  //   })
  // );

  /** Definition for apollo link query definition */
  // interface Definition {
  //   kind: string;
  //   operation?: string;
  // }

  // const link = ApolloLink.from([
  //   basic,
  //   split(
  //     ({ query }) => {
  //       const { kind, operation }: Definition = getMainDefinition(query);
  //       return kind === 'OperationDefinition' && operation === 'subscription';
  //     },
  //     ws,
  //     http
  //   ),
  // ]);

  // Cache is not currently used, due to fetchPolicy values
  const cache = new InMemoryCache();

  return {
    link: http,
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
      deps: [HttpLink, HttpClient],
    },
  ],
})
export class GraphQLModule {}
