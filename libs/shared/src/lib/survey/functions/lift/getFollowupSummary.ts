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

  const actions_checklist = this.survey.getQuestionByName(
    // `checklist_${idx}_actions`
    `checklist_${checklist}`
  );
  const followups = this.survey.getQuestionByName('follow_ups');

  const followup = followups?.value[idx];
  const { previous_followup_rows_with_issues_gls } = followup;
  const res: Record<string, Record<string, string>> = {};

  if (Array.isArray(previous_followup_rows_with_issues_gls)) {
    (previous_followup_rows_with_issues_gls ?? []).forEach((row: string) => {
      let summary = `Initial inspection: ${
        actions_checklist?.value[row].inspection_action ?? ''
      }\n\t${actions_checklist?.value[row].checklist_comment ?? ''}`;

      for (let i = 0; i < idx; i++) {
        const followup = followups?.value[i];
        const { checklist_gls } = followup;
        if (checklist_gls[row]) {
          summary += `\nFollow-up ${i + 1}: ${
            checklist_gls[row].inspection_action ?? ''
          }\n\t${checklist_gls[row].checklist_comment ?? ''}`;
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
