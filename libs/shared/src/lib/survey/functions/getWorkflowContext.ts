import { SurveyModel } from 'survey-core';
import { isNil } from 'lodash';
import { GlobalOptions } from '../types';

/**
 * Returns the specified workflow context variable
 *
 * @param this survey instance
 * @param this.survey survey instance
 * @param params params passed to the function (dashboardId, widgetId)
 * @returns The specified workflow context variable
 */
function getWorkflowContext(this: { survey: SurveyModel }, params: any[]) {
  // First param is the dashboard id
  const dashboardId = params[0];
  if (!dashboardId) return null;
  // Second param is the widget id
  const widgetId = params[1];
  if (isNil(widgetId)) return null;
  // Return the variable
  return this.survey.getVariable(`workflow_${dashboardId}_${widgetId}`);
}

/**
 *  Generator for the custom function getWorkflowContext.
 *
 * @param _ Global options
 * @returns The custom function getWorkflowContext
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getWorkflowContext;
