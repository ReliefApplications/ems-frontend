import { ApolloLink, Observable } from '@apollo/client';

/**
 * Gets the message in the graphql error
 *
 * @param errors GraphQL error
 * @returns formatted message
 */
export const errorMessageFormatter = (errors: any): string =>
  (errors.networkError || errors)?.[0].message ?? '';

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
        next(value) {
          if (value.errors) {
            observer.error(value.errors);
          } else {
            observer.next(value);
          }
        },
        error(networkError) {
          errorCallback({ networkError, operation });
          observer.error(networkError);
        },
        complete() {
          observer.complete();
        },
      });
      return () => subscription.unsubscribe();
    });
  });
