import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../utils/components.enum';

export type SurveyQuery = {
  url: string;
  query: string;
  name: string;
  // Maps the query variables to the question values and whether they are required
  variables: Record<
    string,
    {
      question: string;
      required: boolean;
    }
  >;
};

/**
 * List of available queries for the survey creator
 */
export class QuestionSurveyQueriesModel extends Question {
  /**
   * Return the registered question type in the survey serializer
   *
   * @returns {CustomPropertyGridComponentTypes} question type
   */
  override getType() {
    return CustomPropertyGridComponentTypes.surveyQueries;
  }
}
