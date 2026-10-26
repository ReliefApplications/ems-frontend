import { ComponentRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentCollection, Serializer, SurveyModel } from 'survey-core';
import { DomService } from '../../services/dom/dom.service';
import {
  FILES_UPLOAD_ALLOWED_PROPERTIES,
  FILES_UPLOAD_QUESTION_TYPE,
  FilesUploadQuestion,
  init,
} from './files-upload';

/** Instance surface of the rendered component used by the question. */
interface FakeInstance {
  survey?: SurveyModel;
  question?: FilesUploadQuestion;
  refresh: jest.Mock;
}

describe('files upload question', () => {
  let appended: ComponentRef<FakeInstance>[];
  let domService: Pick<
    DomService,
    'appendComponentToBody' | 'removeComponentFromBody'
  >;

  beforeAll(() => {
    domService = {
      appendComponentToBody: jest.fn(
        (_: unknown, parent: HTMLElement): ComponentRef<FakeInstance> => {
          const nativeElement = document.createElement(
            'shared-files-upload-question'
          );
          parent.appendChild(nativeElement);
          const ref = {
            instance: { refresh: jest.fn() },
            location: { nativeElement },
            changeDetectorRef: { detectChanges: jest.fn() },
          } as unknown as ComponentRef<FakeInstance>;
          appended.push(ref);
          return ref;
        }
      ) as any,
      removeComponentFromBody: jest.fn((ref: ComponentRef<FakeInstance>) =>
        ref.location.nativeElement.remove()
      ),
    };
    const injector = {
      get: (token: unknown): unknown => {
        if (token === DomService) return domService;
        if (token === TranslateService)
          return { instant: (key: string) => key, currentLang: 'en' };
        if (token === 'environment')
          return { availableLanguages: ['en', 'fr'] };
        throw new Error('Unexpected injection token');
      },
    } as Injector;
    init(injector, ComponentCollection.Instance);
  });

  beforeEach(() => {
    appended = [];
    jest.clearAllMocks();
  });

  /**
   * Builds a survey holding a file question and a files upload question.
   *
   * @returns Survey model
   */
  const createSurvey = (): SurveyModel =>
    new SurveyModel({
      title: { default: 'Files', fr: 'Fichiers' },
      elements: [
        { type: 'file', name: 'attachments', title: 'Attachments' },
        { type: 'file', name: 'cover' },
        {
          type: FILES_UPLOAD_QUESTION_TYPE,
          name: 'upload',
          targetField: 'cover',
          defaultLanguage: 'fr',
        },
      ],
    });

  it('hides options related to a stored value in the form builder', () => {
    [
      'valueName',
      'defaultValue',
      'isRequired',
      'requiredIf',
      'readOnly',
      'validators',
    ].forEach((property) =>
      expect(FILES_UPLOAD_ALLOWED_PROPERTIES).not.toContain(property)
    );
    [
      'title',
      'description',
      'tooltip',
      'targetField',
      'allowedLanguages',
      'defaultLanguage',
    ].forEach((property) =>
      expect(FILES_UPLOAD_ALLOWED_PROPERTIES).toContain(property)
    );
  });

  /**
   * Resolves the property grid choices of a question property.
   *
   * @param question Question being edited
   * @param name Property name
   * @returns Choices offered by the property
   */
  const choicesOf = (question: FilesUploadQuestion, name: string): any[] => {
    const callback = jest.fn();
    Serializer.findProperty(FILES_UPLOAD_QUESTION_TYPE, name).getChoices(
      question,
      callback
    );
    return callback.mock.calls[0][0];
  };

  it('registers a question keeping its own properties in the structure', () => {
    const survey = createSurvey();
    const question = survey.getQuestionByName('upload') as FilesUploadQuestion;

    expect(question.getType()).toBe(FILES_UPLOAD_QUESTION_TYPE);
    expect(question.getPropertyValue('targetField')).toBe('cover');
    expect(question.getPropertyValue('defaultLanguage')).toBe('fr');
    expect(question.hideNumber).toBe(true);
    expect(question.isRequired).toBe(false);
    // Never part of the survey data
    expect(survey.data).toEqual({});
  });

  it('offers the file questions and the form languages in the property grid', () => {
    const survey = createSurvey();
    const question = survey.getQuestionByName('upload') as FilesUploadQuestion;

    expect(choicesOf(question, 'targetField')).toEqual([
      { value: 'attachments', text: 'Attachments' },
      { value: 'cover', text: 'cover' },
    ]);
    expect(
      choicesOf(question, 'allowedLanguages').map((c: any) => c.value)
    ).toEqual(['en', 'fr']);
    expect(
      choicesOf(question, 'defaultLanguage').map((c: any) => c.value)
    ).toEqual(['en', 'fr']);
  });

  it('restricts the default language to the allowed languages, kept in the structure', () => {
    const survey = new SurveyModel({
      title: { default: 'Files', fr: 'Fichiers' },
      elements: [
        { type: 'file', name: 'cover' },
        {
          type: FILES_UPLOAD_QUESTION_TYPE,
          name: 'upload',
          allowedLanguages: ['fr'],
        },
      ],
    });
    const question = survey.getQuestionByName('upload') as FilesUploadQuestion;

    // SurveyJS arrays carry extra properties: compare their items
    expect([...question.getPropertyValue('allowedLanguages')]).toEqual(['fr']);
    expect(survey.toJSON().pages[0].elements[1].allowedLanguages).toEqual([
      'fr',
    ]);
    // Multi-select in the property grid, refreshing the default language
    expect(
      Serializer.findProperty(FILES_UPLOAD_QUESTION_TYPE, 'allowedLanguages')
        .type
    ).toBe('multiplevalues');
    expect(
      Serializer.findProperty(
        FILES_UPLOAD_QUESTION_TYPE,
        'allowedLanguages'
      ).getDependedProperties()
    ).toContain('defaultLanguage');
    expect(
      choicesOf(question, 'allowedLanguages').map((c: any) => c.value)
    ).toEqual(['en', 'fr']);
    expect(
      choicesOf(question, 'defaultLanguage').map((c: any) => c.value)
    ).toEqual(['fr']);
  });

  it('renders the component inside the question and refreshes it on file changes', () => {
    const survey = createSurvey();
    const question = survey.getQuestionByName('upload') as FilesUploadQuestion;
    const element = document.createElement('div');
    element.innerHTML = '<div class="sd-question__content"></div>';
    const customQuestion = ComponentCollection.Instance.getCustomQuestionByName(
      FILES_UPLOAD_QUESTION_TYPE
    ) as any;

    customQuestion.json.onAfterRender(question, element);

    expect(appended).toHaveLength(1);
    const ref = appended[0];
    expect(
      element.querySelector('.sd-question__content')?.firstElementChild
    ).toBe(ref.location.nativeElement);
    expect(ref.instance.survey).toBe(survey);
    expect(ref.instance.question).toBe(question);
    expect(ref.instance.refresh).toHaveBeenCalledTimes(1);

    survey.setValue('cover', [{ name: 'a.png', content: 'data:x' }]);
    expect(ref.instance.refresh).toHaveBeenCalledTimes(2);
    survey.setValue('unrelated', 'value');
    expect(ref.instance.refresh).toHaveBeenCalledTimes(2);

    // Re-rendering replaces the previous component
    customQuestion.json.onAfterRender(question, element);
    expect(domService.removeComponentFromBody).toHaveBeenCalledWith(ref);
    expect(appended).toHaveLength(2);
    survey.setValue('cover', []);
    expect(ref.instance.refresh).toHaveBeenCalledTimes(2);
    expect(appended[1].instance.refresh).toHaveBeenCalledTimes(2);

    // Disposing the survey destroys the component
    survey.dispose();
    expect(domService.removeComponentFromBody).toHaveBeenCalledWith(
      appended[1]
    );
  });

  it('follows a bulk data load, which does not fire onValueChanged', () => {
    const survey = createSurvey();
    const question = survey.getQuestionByName('upload') as FilesUploadQuestion;
    const element = document.createElement('div');
    element.innerHTML = '<div class="sd-question__content"></div>';
    const customQuestion = ComponentCollection.Instance.getCustomQuestionByName(
      FILES_UPLOAD_QUESTION_TYPE
    ) as any;

    customQuestion.json.onAfterRender(question, element);
    const ref = appended[0];
    expect(ref.instance.refresh).toHaveBeenCalledTimes(1);

    // A draft record loaded once the form is rendered assigns survey.data
    survey.data = {
      cover: [{ name: 'draft.png', content: 'form-id/blob', draft: true }],
    };
    expect(ref.instance.refresh).toHaveBeenCalledTimes(2);

    survey.clear();
    expect(ref.instance.refresh).toHaveBeenCalledTimes(3);

    // A replaced component no longer follows the files
    customQuestion.json.onAfterRender(question, element);
    survey.data = { cover: [{ name: 'a.png', content: 'data:x' }] };
    expect(ref.instance.refresh).toHaveBeenCalledTimes(3);
    expect(appended[1].instance.refresh).toHaveBeenCalledTimes(2);
    survey.dispose();
  });
});
