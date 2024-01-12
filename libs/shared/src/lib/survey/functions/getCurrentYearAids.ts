import { gql } from '@apollo/client';
import { GlobalOptions } from '../types';
import { SurveyModel } from 'survey-core';
import { firstValueFrom } from 'rxjs';

/**
 *  Generator for the custom function getCurrentYearAids.
 *
 * @param options Global options
 * @returns The custom function getCurrentYearAids
 */
export default (options: GlobalOptions) => {
  const { apollo } = options;

  /**
   * Custom function that gets the number aids
   * of the current year, given the list of prescriptions
   *
   * @param this Self
   * @param this.survey Survey instance
   * @param this.returnResult Function to return the result
   * @param params [prescriptions question]
   * @returns The interval of the current year and the number of aids
   */
  return async function getCurrentYearAids(
    this: {
      survey: SurveyModel;
      returnResult: (
        value: {
          currentYearStart: string;
          currentYearEnd: string;
          numberOfAids: number;
        } | null
      ) => void;
    },
    params: any[]
  ) {
    const prescriptions = params[0];
    if (!prescriptions) {
      this.returnResult(null);
      return;
    }

    const [prescription] = prescriptions;
    if (!prescription) {
      this.returnResult(null);
      return;
    }

    const { start: startStr } = prescription;
    if (!startStr) {
      this.returnResult(null);
      return;
    }

    // Start could be either in the format YYYY-MM-DD or YYYY-MM-DDT00:00:00.000Z syntax
    const start = new Date(startStr.split('T')[0]);
    const currentYearStart = start;
    // The current year
    const currYear = new Date().getFullYear();
    // By default, the date is the current year
    currentYearStart.setFullYear(currYear);
    // But, if the date is in the future, it should be the previous year
    if (currentYearStart > new Date()) {
      currentYearStart.setFullYear(currYear - 1);
    }

    // The end of the current year is the start of the next year
    const currentYearEnd = new Date(currentYearStart);
    currentYearEnd.setFullYear(currentYearStart.getFullYear() + 1);

    // Now that we have the start and end of the current year,
    // we can query the number of aids in that period
    const aids = this.survey.getQuestionByName('all_aids');
    const aidsQuery = gql`
      query GetAidsInInterval($filter: JSON) {
        allAid(filter: $filter) {
          totalCount
        }
      }
    `;

    const res = await firstValueFrom(
      apollo.query<any>({
        query: aidsQuery,
        variables: {
          filter: {
            logic: 'and',
            filters: [
              {
                field: 'ids',
                operator: 'eq',
                value: aids.value,
              },
              {
                field: 'createdAt',
                operator: 'gt',
                value: currentYearStart.toISOString(),
              },
              {
                field: 'createdAt',
                operator: 'lte',
                value: currentYearEnd.toISOString(),
              },
            ],
          },
        },
      })
    );

    /**
     * Format a date to DD/MM/YYYY
     *
     * @param date Date to format
     * @returns The formatted date
     */
    const format = (date: Date) =>
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    // Return the start and end of the current year, as well as the number of aids in that period
    this.returnResult({
      currentYearStart: format(currentYearStart),
      currentYearEnd: format(currentYearEnd),
      numberOfAids: res?.data?.allAid?.totalCount ?? 0,
    });
    return;
  };
};
