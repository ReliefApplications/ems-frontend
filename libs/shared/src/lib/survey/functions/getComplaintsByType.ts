import { GlobalOptions } from '../types';
import {
  QueryResponse,
  QueryVariables,
} from '../../services/query-builder/query-builder.service';
import { gql } from 'apollo-angular';
import { SurveyModel } from 'survey-angular';
import { firstValueFrom } from 'rxjs';
import { Resource } from '../../models/resource.model';

/** Maps each complaint type to its value */
const COMPLAINT_TYPE_MAP = {
  GLS: '1',
  OSH_AI: '2',
  OSH_G: '3',
  SS: '4',
};

/**
 *  Generator for the custom function searchEnterpriseName.
 *
 * @param options Global options
 * @returns The custom function searchEnterpriseName
 */
export default (options: GlobalOptions) => {
  const { apollo } = options;

  /**
   * Custom function that gets the number of complaints per type
   * linked an enterprise, using its list of linked complaints.
   *
   * @param this Self
   * @param this.survey Survey instance
   * @param this.returnResult Function to return the result
   * @param params [complaints question]
   * @returns Matching enterprise names
   */
  return async function getComplaintsByType(
    this: {
      survey: SurveyModel;
      returnResult: (value: string | null) => void;
    },
    params: any[]
  ) {
    const complaintsQuestion = params[0];
    const type =
      COMPLAINT_TYPE_MAP[params[1] as keyof typeof COMPLAINT_TYPE_MAP];

    const question = this.survey.getQuestionByName(complaintsQuestion);
    const complaints = question?.value;
    const resourceID = question.resource;

    if (!resourceID || !complaints || !type) {
      return this.returnResult(null);
    }

    // First we need to get the queryName from the resourceID
    const resourceQuery = gql`
      query GetResourceQueryName($id: ID!) {
        resource(id: $id) {
          queryName
        }
      }
    `;
    const queryNameRes = await firstValueFrom(
      apollo.query<{ resource: Pick<Resource, 'queryName'> }>({
        query: resourceQuery,
        variables: {
          id: resourceID,
        },
      })
    );
    const queryName = queryNameRes.data.resource.queryName || '';

    // Than we query the complaints count by specified type
    const query = gql<QueryResponse, QueryVariables>`
      query GetNumOfComplaintsPerType($filter: JSON) {
        ${queryName}(filter: $filter) {
          totalCount
        }
      }
    `;

    const response = await firstValueFrom(
      apollo.query<any>({
        query,
        variables: {
          filter: {
            logic: 'and',
            filters: [
              {
                field: 'compl_type',
                operator: 'contains',
                value: type,
              },
              {
                logic: 'or',
                filters: complaints.map((complaint: string) => ({
                  field: 'id',
                  operator: 'eq',
                  value: complaint,
                })),
              },
            ],
          },
        },
      })
    );

    const count = response.data[queryName].totalCount;
    this.returnResult(count);
  };
};
