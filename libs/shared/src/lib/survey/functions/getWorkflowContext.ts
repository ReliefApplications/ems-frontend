import { QuestionCustomModel, SurveyModel } from 'survey-core';
import { GlobalOptions } from '../types';

/**
 * Returns the specified workflow context variable
 *
 * @param this survey instance
 * @param this.survey survey instance
 * @param this.question question invoking the function
 * @returns The specified workflow context variable
 */
function getWorkflowContext(this: {
  survey: SurveyModel;
  question: QuestionCustomModel;
}) {
  if (!this.question || !this.survey) {
    return null;
  }

  // Get rows from workflow context
  const rows: string[] = this.survey.getVariable('__WORKFLOW_CONTEXT__') ?? [];
  const sourceQuestionType = this.question.getType();
  switch (sourceQuestionType) {
    case 'resource':
      // Return the first row, if in resource question
      return rows[0] ?? null;
    case 'resources':
      // Return all rows, if in resources question
      return rows;
    default:
      // For now, we only support resource and resources
      return null;
  }
}

/**
 *  Generator for the custom function getWorkflowContext.
 *
 * @param _ Global options
 * @returns The custom function getWorkflowContext
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getWorkflowContext;
