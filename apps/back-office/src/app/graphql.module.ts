import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { environment } from '../environments/environment';
import { buildClientSchema } from 'graphql/utilities';
import { fetch } from 'cross-fetch';

/**
 * Configuration of the Apollo client.
 *
 * @param httpLink Apollo http link
 * @returns void
 */
export const createApollo = async (
  httpLink: HttpLink
): Promise<ApolloClientOptions<any>> => {
  const basic = setContext(() => ({
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json; charset=utf-8',
      UserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  }));

  // Fetch the schema url from back-end
  // NOT WORKING: we must be logged in and here we're not
  // const schemaEndpoint = await fetch(`${environment.apiUrl}/schema/url`);
  // const schemaEndpointString = await schemaEndpoint.text();

  // Fetch the schema file from the fetched endpoint
  // NOT WORKING: CORS ERROR
  const response = await fetch(
    'https://oortdevstorage.blob.core.windows.net/public/introspection/schema?1715023102100'
  );
  const schemaString = await response.text();
  const schema = buildClientSchema(JSON.parse(schemaString));

  const link = ApolloLink.from([
    basic,
    httpLink.create({
      uri: `${environment.apiUrl}/graphql`,
    }),
  ]);

  // Create a link that uses the introspected schema
  const schemaLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ graphqlContext = {} }) => ({
      graphqlContext: {
        ...graphqlContext,
        schema,
      },
    }));

    return forward(operation);
  });

  // Cache is not currently used, due to fetchPolicy values
  const cache = new InMemoryCache();

  return {
    link: ApolloLink.split(
      (operation) => {
        const definition = getMainDefinition(operation.query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      schemaLink.concat(link),
      link
    ),
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
