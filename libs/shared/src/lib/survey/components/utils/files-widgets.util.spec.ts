import { TranslateService } from '@ngx-translate/core';
import { Question as SurveyQuestion, SurveyModel } from 'survey-core';
import {
  applyFileQuestionVisibility,
  checkFileRestrictions,
  FILE_QUESTION_HIDDEN_CLASS,
  getFileQuestionChoices,
  getFileQuestions,
  getKendoFileRestrictions,
  getLanguageChoices,
  getSurveyLanguages,
  registerFileQuestionsVisibility,
  shouldHideFileQuestions,
  syncFileQuestionsVisibility,
} from './files-widgets.util';

/** Translate service surface used to display language names */
const translate = { currentLang: 'en', defaultLang: 'en' } as TranslateService;

/**
 * Builds a survey holding two file questions and a text question.
 *
 * @returns Survey model
 */
const createSurvey = (): SurveyModel => {
  const survey = new SurveyModel({
    elements: [
      {
        type: 'file',
        name: 'attachments',
        title: 'Attachments',
        allowMultiple: true,
        acceptedTypes: '.pdf,.png',
        maxSize: 1000,
      },
      { type: 'file', name: 'cover', valueName: 'cover_image' },
      { type: 'text', name: 'comment', title: 'Comment' },
    ],
  });
  // App-registered property, not part of the bare survey model
  survey
    .getQuestionByName('attachments')
    .setPropertyValue('allowedFileNumber', 2);
  return survey;
};

/**
 * Builds a fake files management question.
 *
 * @param hideFileQuestions Value of its hideFileQuestions property
 * @param isVisible Whether the question is visible
 * @returns Fake question
 */
const createManagementQuestion = (
  hideFileQuestions: boolean,
  isVisible = true
): SurveyQuestion =>
  ({
    getType: () => 'filesmanagement',
    isVisible,
    getPropertyValue: (name: string) =>
      name === 'hideFileQuestions' ? hideFileQuestions : undefined,
  } as unknown as SurveyQuestion);

/**
 * Builds a fake survey.
 *
 * @param questions Questions of the survey
 * @param isDesignMode Whether the survey is edited in the form builder
 * @returns Fake survey
 */
const createFakeSurvey = (
  questions: SurveyQuestion[],
  isDesignMode = false
): SurveyModel =>
  ({
    isDesignMode,
    getAllQuestions: () => questions,
    onVisibleChanged: { add: jest.fn() },
  } as unknown as SurveyModel);

/**
 * Builds a native file.
 *
 * @param name File name
 * @param type Mime type
 * @param size Size in bytes
 * @returns File
 */
const createFile = (name: string, type: string, size = 10): File =>
  new File([new Array(size + 1).join('x')], name, { type });

/**
 * Renders a SurveyJS-like row holding a question, in the document.
 *
 * @param id Question id
 * @returns Question root element, column wrapper and row
 */
const renderRow = (id: string) => {
  const row = document.createElement('div');
  row.className = 'sd-row sd-clearfix sd-page__row';
  row.innerHTML = `<div style="flex: 1 1 100%"><div class="sd-question sd-element" id="${id}"><div class="sd-question__content"></div></div></div>`;
  document.body.appendChild(row);
  const root = row.querySelector<HTMLElement>('.sd-question') as HTMLElement;
  return { row, wrapper: root.parentElement as HTMLElement, root };
};

describe('files widgets utils', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('file questions', () => {
    it('lists the file questions of the survey, in order', () => {
      const survey = createSurvey();
      expect(getFileQuestions(survey).map((q) => q.name)).toEqual([
        'attachments',
        'cover',
      ]);
      expect(getFileQuestions(undefined)).toEqual([]);
    });

    it('builds choices from the question title, which defaults to its name', () => {
      expect(getFileQuestionChoices(createSurvey())).toEqual([
        { value: 'attachments', text: 'Attachments' },
        { value: 'cover', text: 'cover' },
      ]);
    });
  });

  describe('languages', () => {
    it('combines the system default language with the form translations available in the system', () => {
      const survey = new SurveyModel({
        title: { default: 'Hello', fr: 'Bonjour', ua: 'Привіт', de: 'Hallo' },
      });
      // 'ua' is SurveyJS's code for Ukrainian, 'de' is not available
      expect(getSurveyLanguages(survey, ['en', 'fr', 'uk'])).toEqual([
        'en',
        'fr',
        'uk',
      ]);
    });

    it('offers only the default language for a form without translations', () => {
      expect(getSurveyLanguages(createSurvey(), ['en', 'fr'])).toEqual(['en']);
      expect(getSurveyLanguages(undefined, ['en', 'fr'])).toEqual(['en']);
      expect(getSurveyLanguages(createSurvey(), [])).toEqual([]);
    });

    it('displays language names', () => {
      const survey = new SurveyModel({
        title: { default: 'Hello', fr: 'Bonjour' },
      });
      const choices = getLanguageChoices(survey, ['en', 'fr'], translate);
      expect(choices.map((choice) => choice.value)).toEqual(['en', 'fr']);
      expect(choices[1].text).toBe('French');
    });
  });

  describe('restrictions', () => {
    it('maps extensions and maximum size to Kendo restrictions', () => {
      const [attachments, cover] = getFileQuestions(createSurvey());
      expect(getKendoFileRestrictions(attachments)).toEqual({
        allowedExtensions: ['pdf', 'png'],
        maxFileSize: 1000,
      });
      expect(getKendoFileRestrictions(cover)).toEqual({});
    });

    it('leaves mime types out of Kendo restrictions, which cannot express them', () => {
      const [attachments] = getFileQuestions(createSurvey());
      attachments.setPropertyValue('acceptedTypes', '.pdf,image/*');
      expect(getKendoFileRestrictions(attachments)).toEqual({
        maxFileSize: 1000,
      });
    });

    it('rejects a second file on a single-file question', () => {
      const [, cover] = getFileQuestions(createSurvey());
      expect(
        checkFileRestrictions(cover, 1, [createFile('a.png', 'image/png')])
      ).toEqual({ key: 'components.filesUpload.errors.singleFileOnly' });
      expect(
        checkFileRestrictions(cover, 0, [createFile('a.png', 'image/png')])
      ).toBeNull();
    });

    it('rejects files exceeding the allowed number, counting existing ones', () => {
      const [attachments] = getFileQuestions(createSurvey());
      const files = [
        createFile('a.pdf', 'application/pdf'),
        createFile('b.pdf', 'application/pdf'),
      ];
      expect(checkFileRestrictions(attachments, 1, files)).toEqual({
        key: 'components.filesUpload.errors.maximumAllowedFiles',
        params: { number: 2 },
      });
      expect(checkFileRestrictions(attachments, 0, files)).toBeNull();
      expect(checkFileRestrictions(attachments, 5, [])).toBeNull();
    });

    it('checks mime types and wildcards itself when Kendo cannot', () => {
      const [attachments] = getFileQuestions(createSurvey());
      attachments.setPropertyValue('acceptedTypes', 'image/*,application/pdf');
      expect(
        checkFileRestrictions(attachments, 0, [
          createFile('a.png', 'image/png'),
          createFile('notes.txt', 'text/plain'),
        ])
      ).toEqual({
        key: 'components.filesUpload.errors.invalidType',
        params: { name: 'notes.txt' },
      });
      expect(
        checkFileRestrictions(attachments, 0, [
          createFile('a.png', 'image/png'),
          createFile('b.pdf', 'application/pdf'),
        ])
      ).toBeNull();
    });

    it('leaves extension checks to Kendo', () => {
      const [attachments] = getFileQuestions(createSurvey());
      expect(
        checkFileRestrictions(attachments, 0, [
          createFile('notes.txt', 'text/plain'),
        ])
      ).toBeNull();
    });
  });

  describe('file questions visibility', () => {
    it('hides file questions when a visible files management question asks for it, outside the form builder', () => {
      expect(
        shouldHideFileQuestions(
          createFakeSurvey([createManagementQuestion(true)])
        )
      ).toBe(true);
      expect(
        shouldHideFileQuestions(
          createFakeSurvey([createManagementQuestion(false)])
        )
      ).toBe(false);
      expect(
        shouldHideFileQuestions(
          createFakeSurvey([createManagementQuestion(true, false)])
        )
      ).toBe(false);
      expect(
        shouldHideFileQuestions(
          createFakeSurvey([createManagementQuestion(true)], true)
        )
      ).toBe(false);
      expect(shouldHideFileQuestions(createFakeSurvey([]))).toBe(false);
      expect(shouldHideFileQuestions(undefined)).toBe(false);
    });

    it('hides the whole row column of a rendered file question, from any element inside it', () => {
      const { wrapper, root } = renderRow('sq_1');
      const survey = createFakeSurvey([createManagementQuestion(true)]);

      applyFileQuestionVisibility(
        survey,
        root.querySelector('.sd-question__content') as HTMLElement
      );
      expect(wrapper.classList).toContain(FILE_QUESTION_HIDDEN_CLASS);
      expect(root.classList).not.toContain(FILE_QUESTION_HIDDEN_CLASS);

      applyFileQuestionVisibility(
        createFakeSurvey([createManagementQuestion(false)]),
        root
      );
      expect(wrapper.classList).not.toContain(FILE_QUESTION_HIDDEN_CLASS);
    });

    it('hides the question itself when it is not rendered in a row', () => {
      const root = document.createElement('div');
      root.className = 'sd-question';
      document.body.appendChild(root);

      applyFileQuestionVisibility(
        createFakeSurvey([createManagementQuestion(true)]),
        root
      );
      expect(root.classList).toContain(FILE_QUESTION_HIDDEN_CLASS);
    });

    it('syncs every rendered file question of the survey', () => {
      const first = renderRow('sq_1');
      const second = renderRow('sq_2');
      const fileQuestion = (id: string) =>
        ({ getType: () => 'file', id } as unknown as SurveyQuestion);
      const survey = createFakeSurvey([
        createManagementQuestion(true),
        fileQuestion('sq_1'),
        fileQuestion('sq_2'),
        fileQuestion('sq_not_rendered'),
      ]);

      syncFileQuestionsVisibility(survey, document);
      expect(first.wrapper.classList).toContain(FILE_QUESTION_HIDDEN_CLASS);
      expect(second.wrapper.classList).toContain(FILE_QUESTION_HIDDEN_CLASS);
    });

    it('re-syncs when a files management question is shown or hidden, registering once per survey', () => {
      const { wrapper } = renderRow('sq_1');
      const management = createManagementQuestion(true);
      const survey = createFakeSurvey([
        management,
        { getType: () => 'file', id: 'sq_1' } as unknown as SurveyQuestion,
      ]);
      const add = survey.onVisibleChanged.add as jest.Mock;

      registerFileQuestionsVisibility(survey, document);
      registerFileQuestionsVisibility(survey, document);
      expect(add).toHaveBeenCalledTimes(1);

      const handler = add.mock.calls[0][0];
      handler(survey, { question: management });
      expect(wrapper.classList).toContain(FILE_QUESTION_HIDDEN_CLASS);

      (management as any).isVisible = false;
      handler(survey, { question: management });
      expect(wrapper.classList).not.toContain(FILE_QUESTION_HIDDEN_CLASS);

      // Other questions do not trigger a sync
      (management as any).isVisible = true;
      handler(survey, { question: { getType: () => 'text' } });
      expect(wrapper.classList).not.toContain(FILE_QUESTION_HIDDEN_CLASS);
    });
  });
});
