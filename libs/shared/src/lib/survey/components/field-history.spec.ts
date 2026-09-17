import { Question as SurveyQuestion, SurveyModel } from 'survey-core';
import {
  applyFieldHistoryPanelDom,
  configureFieldHistoryQuestion,
  getFieldHistoryChoices,
  isFieldHistoryNeutral,
  resolveFieldHistoryField,
} from './field-history';

describe('field history question', () => {
  it('offers only value-bearing fields from the current survey', () => {
    const fieldHistory = {
      getType: () => 'field-history',
    } as SurveyQuestion;
    const questions = [
      {
        getType: () => 'text',
        name: 'question1',
        title: 'Status',
        valueName: 'status',
      },
      { getType: () => 'html', name: 'instructions', title: 'Instructions' },
      { getType: () => 'image', name: 'logo', title: 'Logo' },
      { getType: () => 'expression', name: 'total', title: 'Total' },
      {
        getType: () => 'resources',
        getPropertyValue: () => true,
        name: 'related_records',
        title: 'Related records',
      },
      fieldHistory,
    ] as SurveyQuestion[];
    Object.assign(fieldHistory, {
      survey: { getAllQuestions: () => questions },
    });

    expect(getFieldHistoryChoices(fieldHistory)).toEqual([
      { value: 'question:question1', text: 'Status' },
    ]);
  });

  it('resolves a saved question name to its generated record data field', () => {
    const targetQuestion = {
      getType: () => 'text',
      name: 'question1',
      valueName: 'first_name',
      title: 'First Name',
    } as SurveyQuestion;
    const fieldHistory = {
      getType: () => 'field-history',
      field: 'question1',
    } as SurveyQuestion & { field: string };
    Object.assign(fieldHistory, {
      survey: { getAllQuestions: () => [targetQuestion, fieldHistory] },
    });

    expect(resolveFieldHistoryField(fieldHistory)).toBe('first_name');
  });

  it('keeps the selected question when its data field is renamed', () => {
    const targetQuestion = {
      name: 'question1',
      valueName: 'renamed_first_name',
    } as SurveyQuestion;
    const fieldHistory = {
      field: 'question1',
    } as SurveyQuestion & { field: string };
    Object.assign(fieldHistory, {
      survey: { getAllQuestions: () => [targetQuestion, fieldHistory] },
    });

    expect(resolveFieldHistoryField(fieldHistory)).toBe('renamed_first_name');
  });

  it('prefers an exact data field over a colliding question name', () => {
    const nameMatch = {
      name: 'first_name',
      valueName: 'unrelated_field',
    } as SurveyQuestion;
    const valueNameMatch = {
      name: 'question1',
      valueName: 'first_name',
    } as SurveyQuestion;
    const fieldHistory = {
      field: 'first_name',
    } as SurveyQuestion & { field: string };
    Object.assign(fieldHistory, {
      survey: {
        getAllQuestions: () => [nameMatch, valueNameMatch, fieldHistory],
      },
    });

    expect(resolveFieldHistoryField(fieldHistory)).toBe('first_name');
  });

  it('resolves a stable question reference before a colliding data field', () => {
    const selectedQuestion = {
      name: 'question1',
      valueName: 'first_name',
      title: 'First Name',
    } as SurveyQuestion;
    const collision = {
      name: 'question2',
      valueName: 'question1',
      title: 'Other field',
    } as SurveyQuestion;
    const fieldHistory = {
      field: 'question:question1',
    } as SurveyQuestion & { field: string };
    Object.assign(fieldHistory, {
      survey: {
        getAllQuestions: () => [collision, selectedQuestion, fieldHistory],
      },
    });

    expect(resolveFieldHistoryField(fieldHistory)).toBe('first_name');
  });

  it('uses its SurveyJS title as a collapsed panel header', () => {
    const fieldHistory = {
      state: 'default',
      titleLocation: 'hidden',
      readOnly: false,
      isRequired: true,
    } as SurveyQuestion;

    configureFieldHistoryQuestion(fieldHistory);

    expect(fieldHistory.titleLocation).toBe('top');
    expect(fieldHistory.state).toBe('collapsed');
    expect(fieldHistory.readOnly).toBe(true);
    expect(fieldHistory.isRequired).toBe(false);
  });

  it('preserves an explicitly expanded panel state', () => {
    const fieldHistory = {
      state: 'expanded',
    } as SurveyQuestion;

    configureFieldHistoryQuestion(fieldHistory);

    expect(fieldHistory.state).toBe('expanded');
  });

  it('applies panel classes to an already-rendered question', () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="sd-question__header">
        <div class="sd-question__title">History</div>
      </div>
      <div class="sd-question__content"></div>
    `;

    applyFieldHistoryPanelDom(element);

    expect(element.classList).toContain('sd-element--with-frame');
    expect(element.classList).toContain('sd-panel');
    expect(element.querySelector('.sd-question__header')?.classList).toContain(
      'sd-panel__header'
    );
    expect(element.querySelector('.sd-question__content')?.classList).toContain(
      'sd-panel__content'
    );
    expect(element.querySelector('.sd-question__title')?.classList).toContain(
      'sd-panel__title'
    );
  });

  it('loads history for an existing record opened in display mode', () => {
    const survey = new SurveyModel();
    survey.mode = 'display';

    expect(isFieldHistoryNeutral(survey, { id: 'record-id' })).toBe(false);
  });
});
