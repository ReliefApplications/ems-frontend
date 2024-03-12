import { ApolloLink, Observable } from '@apollo/client';
import { isNil } from 'lodash';

/**
 * Gets the message in the graphql error
 *
 * @param errors GraphQL error
 * @returns formatted message
 */
export const errorMessageFormatter = (errors: any): string => {
  let messages = [];
  if (errors.networkError.length) {
    messages = errors.networkError.map((x: any) => x.message);
  }
  if (errors.protocolErrors.length) {
    messages = errors.protocolErrors.map((x: any) => x.message);
  }
  if (errors.clientErrors.length) {
    messages = errors.clientErrors.map((x: any) => x.message);
  }
  if (errors.graphQLErrors.length) {
    messages = errors.graphQLErrors.map((x: any) => x.message);
  }
  return messages.join(', ');
};

/**
 * Create apollo link to handle any incoming graphQL error
 *
 * @param errorCallback error callback action when encountering an error
 * @returns current graphql observable
 */
export const createGraphQlErrorHandler = (errorCallback: any) =>
  new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      const observable = forward(operation);
      const subscription = observable.subscribe({
        /**
         * Handle successful request
         *
         * @param value Value sent from the GraphQL request
         */
        next(value) {
          if (
            value.errors &&
            // And all involved data in the request are nullish
            Object.keys(value.data ?? {}).every((key) =>
              isNil(value.data?.[key])
            )
          ) {
            observer.error(value.errors);
          } else {
            observer.next(value);
          }
        },
        /**
         * Handle error request
         *
         * @param networkError Error sent from GraphQL request
         */
        error(networkError) {
          errorCallback(networkError);
          observer.error(networkError);
        },
        /**
         * Complete given observable by default
         */
        complete() {
          observer.complete();
        },
      });
      return () => subscription.unsubscribe();
    });
  });
