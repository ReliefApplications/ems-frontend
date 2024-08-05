import { SurveyModel } from 'survey-core';
import { GlobalOptions } from '../../types';

/**
 *  Generator for the custom function getFollowupSummary.
 *
 * @param options Global options
 * @param options.translateService The translation service
 * @returns The custom function getFollowupSummary
 */
export default ({ translateService }: GlobalOptions) => {
  const strings = {
    NONE: () => translateService.instant('common.none'),
    N_A: () => 'N/A',
    INITIAL_INSPECTION: () =>
      translateService.instant(
        'survey.customFunctions.getFollowupSummary.initialInspection'
      ),
    COMMENT: () =>
      translateService.instant(
        'survey.customFunctions.getFollowupSummary.comment'
      ),
    INSPECTION_ACTION: () =>
      translateService.instant(
        'survey.customFunctions.getFollowupSummary.inspectionAction'
      ),
    FOLLOW_UP: (idx: number) =>
      translateService.instant(
        'survey.customFunctions.getFollowupSummary.followUp.numbered',
        { number: idx }
      ),
  };

  /**
   * Registration of new custom functions for the survey.
   *
   * @param this Survey instance
   * @param this.survey Survey instance
   * @param params the index of the follow-up
   * @returns A prebuilt matrix, to initialize the values of the follow-up checklist
   */
  function getFollowupSummary(this: { survey: SurveyModel }, params: any[]) {
    const checklistNames = [
      'gls',
      'osh_a_i',
      'osh_ps',
      'social_security',
      'boiler',
    ] as const;
    const idx: number = params[0];
    const checklist: (typeof checklistNames)[number] = params[1];

    if (typeof idx !== 'number' || idx < 0) {
      return {};
    }

    if (!checklistNames.includes(checklist)) {
      return {};
    }

    const actionsChecklist = this.survey.getQuestionByName(
      `checklist_${checklist}_actions`
    );
    const followups = this.survey.getQuestionByName('follow_ups');

    const followup = followups?.value[idx];
    const previousIssues =
      followup?.[`previous_followup_rows_with_issues_${checklist}`];
    const res: Record<string, Record<string, string>> = {};

    if (Array.isArray(previousIssues)) {
      (previousIssues ?? []).forEach((row: string) => {
        const initialAction =
          actionsChecklist?.value[row].checklist_inspection_action ??
          strings.NONE();
        const initialComment =
          actionsChecklist?.value[row].checklist_comment ?? strings.N_A();
        let summary = `${strings.INITIAL_INSPECTION()}\n\t➤ ${strings.COMMENT()}: ${initialComment}\n\t➤ ${strings.INSPECTION_ACTION()}: ${initialAction}`;

        for (let i = 0; i < idx; i++) {
          const followup = followups?.value[i];
          const checklistPanel = followup[`checklist_${checklist}_panel`];
          const comment =
            checklistPanel[row]?.checklist_comment ?? strings.N_A();
          const action = checklistPanel[row]?.inspection_action ?? '';
          if (checklistPanel[row]) {
            summary += `\n\n${strings.FOLLOW_UP(
              i + 1
            )}\n\t➤ ${strings.COMMENT()}: ${comment}\n\t➤ ${strings.INSPECTION_ACTION()}: ${action}`;
          }
        }

        res[row] = { summary: summary };
      });
    }

    return res;
  }

  return getFollowupSummary;
};
