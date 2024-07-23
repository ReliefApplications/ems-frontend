import { SurveyModel } from 'survey-core';
import { GlobalOptions } from '../../types';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params the index of the follow-up
 * @returns A prebuilt matrix, to initialize the values of the follow-up checklist
 */
function getFollowupSummary(this: { survey: SurveyModel }, params: any[]) {
  const idx: number = params[0];
  const checklist: 'gls' | 'osh_a_i' | 'osh_ps' | 'social_security' = params[1];

  if (typeof idx !== 'number' || idx < 0) {
    return {};
  }

  if (!['gls', 'osh_a_i', 'osh_ps', 'social_security'].includes(checklist)) {
    return {};
  }

  const actionsChecklist = this.survey.getQuestionByName(
    `checklist_${checklist}`
  );
  const followups = this.survey.getQuestionByName('follow_ups');

  const followup = followups?.value[idx];
  const previousIssues =
    followup?.[`previous_followup_rows_with_issues_${checklist}`];
  const res: Record<string, Record<string, string>> = {};

  if (Array.isArray(previousIssues)) {
    (previousIssues ?? []).forEach((row: string) => {
      const initialAction =
        actionsChecklist?.value[row].inspection_action ?? '';
      const initialComment =
        actionsChecklist?.value[row].checklist_comment ?? 'N/A';
      let summary = `Initial inspection\n\t➤ Comment: ${initialComment}\n\t➤ Inspection action: ${initialAction}`;

      for (let i = 0; i < idx; i++) {
        const followup = followups?.value[i];
        const checklistPanel = followup[`checklist_${checklist}_panel`];
        const comment = checklistPanel[row]?.checklist_comment ?? 'N/A';
        const action = checklistPanel[row]?.inspection_action ?? '';
        if (checklistPanel[row]) {
          summary += `\n\nFollow-up #${
            i + 1
          }\n\t➤ Comment: ${comment}\n\t➤ Inspection action: ${action}`;
        }
      }

      res[row] = { summary: summary };
    });
  }

  return res;
}

/**
 *  Generator for the custom function getFollowupSummary.
 *
 * @param _ Global options
 * @returns The custom function getFollowupSummary
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getFollowupSummary;
