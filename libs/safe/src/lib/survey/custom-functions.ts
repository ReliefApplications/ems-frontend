import { Record } from '../models/record.model';
import { SafeAuthService } from '../services/auth/auth.service';
import {
  QueryResponse,
  QueryVariables,
} from '../services/query-builder/query-builder.service';
import { functions } from './functions';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param survey Survey instance
 * @param authService Shared auth service
 * @param record Current record
 * @param apollo apollo service
 */
const addCustomFunctions = (
  survey: any,
  authService: SafeAuthService,
  record: Record | undefined,
  apollo: Apollo
): void => {
  // Register custom functions related to the record
  survey.FunctionFactory.Instance.register('createdAt', () =>
    record ? new Date(Number(record.createdAt) || '') : new Date()
  );
  survey.FunctionFactory.Instance.register('modifiedAt', () =>
    record ? new Date(Number(record.modifiedAt) || '') : new Date()
  );
  survey.FunctionFactory.Instance.register('createdBy', () => {
    if (record) {
      return record.createdBy?.name || '';
    } else {
      return authService.userValue?.name || '';
    }
  });
  survey.FunctionFactory.Instance.register('id', () =>
    record ? record.id : 'unknown id'
  );

  // params passed to the function (questionName, queryName)
  survey.FunctionFactory.Instance.register(
    'searchEnterpriseName',
    async (params: any[]) => {
      const questionName = params[0];
      const queryName = params[1];
      const searchValue = params[2];
      if (questionName && searchValue && queryName) {
        const query = gql<QueryResponse, QueryVariables>`
          query GetCustomQuery($first: Int, $filter: JSON) {
            ${queryName}(first: $first, filter: $filter) {
              edges {
                node {
                  ${questionName}
                }
                meta
              }
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `;
        const filter = [
          {
            logic: 'and',
            filters: [
              {
                field: questionName,
                operator: 'contains',
                value: searchValue,
              },
            ],
          },
        ];

        const response = await firstValueFrom(
          apollo.query<any>({
            query,
            variables: {
              first: 10,
              filter,
            },
          })
        );

        const names: string[] = response.data[queryName].edges.map(
          (edge: any) => edge.node[questionName]
        );
        return names.join() || 'No results';
      }
      return 'Invalid expression params';
    }
  );

  // Register custom functions from the functions folder
  functions.forEach((fn) => {
    survey.FunctionFactory.Instance.register(fn.name, fn.fn);
  });
};

export default addCustomFunctions;
