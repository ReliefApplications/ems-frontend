import { GlobalOptions } from '../types';
import {
  QueryResponse,
  QueryVariables,
} from '../../services/query-builder/query-builder.service';
import { gql } from 'apollo-angular';
import { SurveyModel } from 'survey-angular';
import { firstValueFrom } from 'rxjs';

/** Default number similar names to query */
const EXAMPLES_TO_FETCH = 5;

/**
 *  Generator for the custom function searchEnterpriseName.
 *
 * @param options Global options
 * @returns The custom function searchEnterpriseName
 */
export default (options: GlobalOptions) => {
  const { apollo, form } = options;

  /**
   * Custom function that searches for the current enterprise name being entered.
   *
   * @param this Self
   * @param this.survey Survey instance
   * @param this.returnResult Function to return the result
   * @param params [questionName (optional)]
   * @returns Matching enterprise names
   */
  return async function searchEnterpriseName(
    this: {
      survey: SurveyModel;
      returnResult: (value: string | null) => void;
    },
    params: any[]
  ) {
    if (!form?.queryName) {
      return this.returnResult(null);
    }
    // Tries to get the question name from the params, or defaults to 'name'
    const question = this.survey.getQuestionByName(params[0] ?? 'name');

    if (!question || !question.value) {
      return this.returnResult(null);
    }
    const query = gql<QueryResponse, QueryVariables>`
        query GetCustomQuery($first: Int, $filter: JSON) {
          ${form.queryName}(first: $first, filter: $filter) {
            edges {
              node {
                ${question.name}
              }
            }
          }
        }
      `;

    const response = await firstValueFrom(
      apollo.query<any>({
        query,
        variables: {
          first: EXAMPLES_TO_FETCH,
          filter: {
            logic: 'and',
            filters: [
              {
                field: question.name,
                operator: 'contains',
                value: question.value,
              },
            ],
          },
        },
      })
    );

    const names: string[] = response.data[form.queryName].edges.map(
      (edge: any) => edge.node[question.name]
    );
    if (names.length === 0) {
      return this.returnResult(null);
    }

    return this.returnResult(`
    <div class="flex flex-col ml-[14px]">
      ${names
        .map((n) => {
          const name = `<p>${n}</p>`;
          // match the corresponding value in the name and put it in bold
          const match = n.match(new RegExp(question.value, 'gi'));
          return match
            ? name.replace(
                new RegExp(question.value, 'gi'),
                `<b>${match[0]}</b>`
              )
            : name;
        })
        .join('')}
    </div>
    `);
  };
};
