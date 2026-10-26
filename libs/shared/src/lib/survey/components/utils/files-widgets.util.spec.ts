import { TranslateService } from '@ngx-translate/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SurveyModel,
} from 'survey-core';
import {
  applyFileQuestionVisibility,
  checkFileRestrictions,
  FILE_QUESTION_HIDDEN_CLASS,
  HIDE_FILE_QUESTIONS_PROPERTY,
  FILES_MANAGEMENT_QUESTION_TYPE,
  getFileQuestionChoices,
  getFileQuestions,
  getKendoFileRestrictions,
  getLanguageChoices,
  getSurveyLanguages,
  restrictLanguages,
  registerFileQuestionsVisibility,
  shouldHideFileQuestions,
  syncFileQuestionsVisibility,
  keepsFilesOnComplete,
  registerHiddenFileQuestionsValues,
  observeFileQuestionsValues,
  areTranslationsEnabled,
  getTranslationLanguages,
  getMissingTranslationLanguages,
  getTranslations,
  getTranslationSource,
  linkTranslation,
  ALLOW_TRANSLATIONS_PROPERTY,
  TRANSLATION_LANGUAGES_PROPERTY,
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

    it('restricts the languages to the allowed ones, in form order', () => {
      expect(restrictLanguages(['en', 'fr', 'uk'], ['uk', 'fr'])).toEqual([
        'fr',
        'uk',
      ]);
      const survey = new SurveyModel({
        title: { default: 'Hello', fr: 'Bonjour' },
      });
      expect(
        getLanguageChoices(survey, ['en', 'fr'], translate, ['fr']).map(
          (choice) => choice.value
        )
      ).toEqual(['fr']);
    });

    it('keeps every language without restriction, or when the restriction matches none of them', () => {
      expect(restrictLanguages(['en', 'fr'], [])).toEqual(['en', 'fr']);
      expect(restrictLanguages(['en', 'fr'], undefined)).toEqual(['en', 'fr']);
      // Translation removed from the form since the restriction was set
      expect(restrictLanguages(['en', 'fr'], ['de'])).toEqual(['en', 'fr']);
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

describe('hidden file questions values', () => {
  beforeAll(() => {
    // Minimal Files management question, enough for the visibility rule
    ComponentCollection.Instance.add({
      name: FILES_MANAGEMENT_QUESTION_TYPE,
      questionJSON: { type: 'html' },
    });
    Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
      name: `${HIDE_FILE_QUESTIONS_PROPERTY}:boolean`,
    });
  });

  afterAll(() => {
    ComponentCollection.Instance.clear();
  });

  /**
   * Builds a survey with every kind of file question.
   *
   * @param management Files management question definition, if any
   * @returns Survey
   */
  const createSurvey = (management?: Record<string, unknown>) =>
    new SurveyModel({
      elements: [
        { type: 'text', name: 'kind' },
        ...(management ? [management] : []),
        { type: 'file', name: 'visibleFiles' },
        { type: 'file', name: 'storage', visible: false },
        {
          type: 'file',
          name: 'conditional',
          visibleIf: '{kind} = "other"',
        },
        {
          type: 'file',
          name: 'explicit',
          visible: false,
          clearIfInvisible: 'onComplete',
        },
      ],
    });
  const hiding = {
    type: FILES_MANAGEMENT_QUESTION_TYPE,
    name: 'management',
    [HIDE_FILE_QUESTIONS_PROPERTY]: true,
  };
  const clearing = (survey: SurveyModel) =>
    ['visibleFiles', 'storage', 'conditional', 'explicit'].map(
      (name) => survey.getQuestionByName(name).clearIfInvisible
    );

  it('keeps the files of the questions hidden by a files management question, unless they define their own rule', () => {
    const survey = createSurvey(hiding);

    registerHiddenFileQuestionsValues(survey);

    expect(clearing(survey)).toEqual(['none', 'none', 'default', 'onComplete']);
    expect(keepsFilesOnComplete(survey.getQuestionByName('storage'))).toBe(
      true
    );
    expect(keepsFilesOnComplete(survey.getQuestionByName('conditional'))).toBe(
      false
    );
    expect(keepsFilesOnComplete(survey.getQuestionByName('explicit'))).toBe(
      false
    );
    survey.setValue('kind', 'other');
    expect(keepsFilesOnComplete(survey.getQuestionByName('conditional'))).toBe(
      true
    );

    survey.data = {
      storage: [{ name: 'a.txt', content: 'id' }],
      conditional: [{ name: 'b.txt', content: 'id' }],
      explicit: [{ name: 'c.txt', content: 'id' }],
    };
    survey.completeLastPage();
    expect(survey.data).toEqual({
      storage: [{ name: 'a.txt', content: 'id' }],
    });
  });

  it('leaves SurveyJS clear hidden file questions without a files management question hiding them', () => {
    const noManagement = createSurvey();
    const notHiding = createSurvey({
      ...hiding,
      [HIDE_FILE_QUESTIONS_PROPERTY]: false,
    });

    registerHiddenFileQuestionsValues(noManagement);
    registerHiddenFileQuestionsValues(notHiding);

    for (const survey of [noManagement, notHiding]) {
      expect(clearing(survey)).toEqual([
        'default',
        'default',
        'default',
        'onComplete',
      ]);
      survey.data = { storage: [{ name: 'a.txt', content: 'id' }] };
      survey.completeLastPage();
      expect(survey.data).toEqual({});
    }
  });

  it('follows the visibility of the files management question', () => {
    const survey = createSurvey({ ...hiding, visibleIf: '{kind} = "files"' });
    registerHiddenFileQuestionsValues(survey);
    expect(clearing(survey)[1]).toBe('default');

    survey.setValue('kind', 'files');
    expect(clearing(survey)[1]).toBe('none');

    survey.setValue('kind', 'other');
    expect(clearing(survey)[1]).toBe('default');

    // Re-evaluated right before SurveyJS clears the invisible values
    survey.setValue('kind', 'files');
    survey.getQuestionByName('storage').clearIfInvisible = 'default';
    survey.setValue('storage', [{ name: 'a.txt', content: 'id' }]);
    survey.completeLastPage();
    expect(survey.data).toEqual({
      kind: 'files',
      storage: [{ name: 'a.txt', content: 'id' }],
    });
  });
});

describe('file questions values observation', () => {
  it('runs the handler however the file questions values change, until stopped', () => {
    const survey = createSurvey();
    const handler = jest.fn();

    const stop = observeFileQuestionsValues(survey, 'widget', handler);

    // Single value changes, through the survey or the question
    survey.setValue('attachments', [{ name: 'a.pdf', content: 'data:a' }]);
    expect(handler).toHaveBeenCalledTimes(1);
    survey.getQuestionByName('cover').value = [
      { name: 'b.png', content: 'id' },
    ];
    expect(handler).toHaveBeenCalledTimes(2);
    // Replacing the array of an already valued question
    survey.getQuestionByName('cover').value = [
      { name: 'b.png', content: 'id', outdated: true },
    ];
    expect(handler).toHaveBeenCalledTimes(3);
    // Non file questions are ignored
    survey.setValue('comment', 'text');
    expect(handler).toHaveBeenCalledTimes(3);

    // Bulk loads do not fire survey.onValueChanged but update the questions
    survey.data = { attachments: [{ name: 'c.pdf', content: 'form/blob' }] };
    expect(handler).toHaveBeenCalledTimes(5);
    survey.clear();
    expect(handler).toHaveBeenCalledTimes(6);

    stop();
    survey.setValue('attachments', [{ name: 'd.pdf', content: 'data:d' }]);
    expect(handler).toHaveBeenCalledTimes(6);
  });

  it('replaces the handler registered under the same key', () => {
    const survey = createSurvey();
    const first = jest.fn();
    const second = jest.fn();

    observeFileQuestionsValues(survey, 'widget', first);
    observeFileQuestionsValues(survey, 'widget', second);
    survey.setValue('attachments', [{ name: 'a.pdf', content: 'data:a' }]);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does nothing without a survey', () => {
    expect(() =>
      observeFileQuestionsValues(undefined, 'k', jest.fn())()
    ).not.toThrow();
  });
});

describe('files translations', () => {
  /**
   * Builds a fake files management question configured for translations.
   *
   * @param allowTranslations Whether translations are allowed
   * @param translationLanguages Translation languages
   * @returns Fake question
   */
  const createQuestion = (
    allowTranslations: boolean,
    translationLanguages?: string[]
  ): SurveyQuestion =>
    ({
      getPropertyValue: (name: string) =>
        name === ALLOW_TRANSLATIONS_PROPERTY
          ? allowTranslations
          : name === TRANSLATION_LANGUAGES_PROPERTY
          ? translationLanguages
          : undefined,
    } as unknown as SurveyQuestion);

  const source = {
    name: 'a.pdf',
    content: 'id-a',
    lang: 'en',
    translationKey: 'k',
  };
  const french = {
    name: 'a-fr.pdf',
    content: 'id-fr',
    lang: 'fr',
    translationOf: 'k',
  };
  const orphan = {
    name: 'b-fr.pdf',
    content: 'id-b-fr',
    lang: 'fr',
    translationOf: 'gone',
  };
  const untagged = { name: 'c.pdf', content: 'id-c' };

  it('reads whether a question allows translations', () => {
    expect(areTranslationsEnabled(createQuestion(true))).toBe(true);
    expect(areTranslationsEnabled(createQuestion(false))).toBe(false);
    expect(areTranslationsEnabled(undefined)).toBe(false);
  });

  it('restricts the form languages to the translation languages, every one of them otherwise', () => {
    const survey = new SurveyModel({
      title: { default: 'Hello', fr: 'Bonjour', es: 'Hola' },
    });
    const available = ['en', 'fr', 'es'];
    expect(
      getTranslationLanguages(
        createQuestion(true, ['es', 'fr']),
        survey,
        available
      )
    ).toEqual(['fr', 'es']);
    expect(
      getTranslationLanguages(createQuestion(true), survey, available)
    ).toEqual(['en', 'fr', 'es']);
    // Translation removed from the form since the languages were set
    expect(
      getTranslationLanguages(createQuestion(true, ['de']), survey, available)
    ).toEqual(['en', 'fr', 'es']);
    expect(getTranslationLanguages(undefined, undefined, available)).toEqual([
      'en',
    ]);
  });

  it('finds the file a translation points to, and the translations of a file', () => {
    const files = [source, french, orphan, untagged];
    expect(getTranslationSource(french, files)).toBe(source);
    expect(getTranslationSource(orphan, files)).toBeUndefined();
    expect(getTranslationSource(source, files)).toBeUndefined();
    expect(getTranslationSource(untagged, files)).toBeUndefined();

    expect(getTranslations(source, files)).toEqual([french]);
    expect(getTranslations(french, files)).toEqual([]);
    expect(getTranslations(untagged, files)).toEqual([]);
  });

  it('lists the translation languages a file still misses', () => {
    const languages = ['en', 'fr', 'es'];
    expect(getMissingTranslationLanguages(source, [french], languages)).toEqual(
      ['es']
    );
    expect(getMissingTranslationLanguages(source, [], languages)).toEqual([
      'fr',
      'es',
    ]);
    // A file without a language can be translated into any language
    expect(getMissingTranslationLanguages(untagged, [], languages)).toEqual(
      languages
    );
    expect(getMissingTranslationLanguages(source, [french], [])).toEqual([]);
  });

  it('links a translation to the file it translates, without mutating the value', () => {
    const value = [orphan, untagged];
    const translation = { name: 'c-fr.pdf', content: 'blob:c', lang: 'fr' };

    const updated = linkTranslation(value, untagged, translation);

    expect(value).toEqual([orphan, untagged]);
    expect(untagged).toEqual({ name: 'c.pdf', content: 'id-c' });
    expect(updated).toHaveLength(3);
    expect(updated[0]).toBe(orphan);
    const key = updated[1].translationKey;
    expect(key).toEqual(expect.any(String));
    expect(updated[1]).toEqual({ ...untagged, translationKey: key });
    expect(updated[2]).toEqual({ ...translation, translationOf: key });
    expect(getTranslationSource(updated[2], updated)).toBe(updated[1]);
  });

  it('reuses the key of a file already translated', () => {
    const translation = { name: 'a-es.pdf', content: 'blob:a', lang: 'es' };
    const updated = linkTranslation([source, french], source, translation);
    expect(updated[0]).toBe(source);
    expect(updated[1]).toBe(french);
    expect(updated[2]).toEqual({ ...translation, translationOf: 'k' });
  });
});
