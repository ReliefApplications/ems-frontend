import { ComponentRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentCollection, Serializer, SurveyModel } from 'survey-core';
import { DomService } from '../../services/dom/dom.service';
import {
  FILES_MANAGEMENT_ALLOWED_PROPERTIES,
  FILES_MANAGEMENT_QUESTION_TYPE,
  FilesManagementQuestion,
  init,
} from './files-management';
import {
  ALLOW_TRANSLATIONS_PROPERTY,
  FILE_QUESTION_HIDDEN_CLASS,
  shouldHideFileQuestions,
  TRANSLATION_LANGUAGES_PROPERTY,
} from './utils/files-widgets.util';

/** Instance surface of the rendered component used by the question. */
interface FakeInstance {
  survey?: SurveyModel;
  question?: FilesManagementQuestion;
  refresh: jest.Mock;
}

describe('files management question', () => {
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
            'shared-files-management-question'
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
          return { currentLang: 'en', defaultLang: 'en' };
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

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Builds a survey holding a file question and a files management question.
   *
   * @param hideFileQuestions Whether the file questions must be hidden
   * @returns Survey model
   */
  const createSurvey = (hideFileQuestions: boolean): SurveyModel =>
    new SurveyModel({
      elements: [
        { type: 'file', name: 'attachments' },
        {
          type: FILES_MANAGEMENT_QUESTION_TYPE,
          name: 'management',
          hideFileQuestions,
        },
      ],
    });

  it('hides options related to a stored value in the form builder', () => {
    [
      'valueName',
      'defaultValue',
      'isRequired',
      'readOnly',
      'validators',
    ].forEach((property) =>
      expect(FILES_MANAGEMENT_ALLOWED_PROPERTIES).not.toContain(property)
    );
    [
      'title',
      'description',
      'tooltip',
      'hideFileQuestions',
      ALLOW_TRANSLATIONS_PROPERTY,
      TRANSLATION_LANGUAGES_PROPERTY,
    ].forEach((property) =>
      expect(FILES_MANAGEMENT_ALLOWED_PROPERTIES).toContain(property)
    );
  });

  it('offers the languages of the form as translation languages, once translations are allowed', () => {
    const survey = new SurveyModel({
      title: { default: 'Hello', fr: 'Bonjour' },
      elements: [{ type: FILES_MANAGEMENT_QUESTION_TYPE, name: 'management' }],
    });
    const question = survey.getQuestionByName(
      'management'
    ) as FilesManagementQuestion;
    const property = Serializer.findProperty(
      FILES_MANAGEMENT_QUESTION_TYPE,
      TRANSLATION_LANGUAGES_PROPERTY
    );

    // Off by default, in every form of a resource
    expect(question.getPropertyValue(ALLOW_TRANSLATIONS_PROPERTY)).toBe(false);
    expect(property.visibleIf(question)).toBe(false);

    question.setPropertyValue(ALLOW_TRANSLATIONS_PROPERTY, true);
    expect(property.visibleIf(question)).toBe(true);
    const choices = jest.fn();
    property.getChoices(question, choices);
    expect(choices).toHaveBeenCalledWith([
      { value: 'en', text: 'English' },
      { value: 'fr', text: 'French' },
    ]);
    survey.dispose();
  });

  it('registers a question whose hide option drives the file questions visibility', () => {
    const survey = createSurvey(true);
    const question = survey.getQuestionByName(
      'management'
    ) as FilesManagementQuestion;

    expect(question.getType()).toBe(FILES_MANAGEMENT_QUESTION_TYPE);
    expect(question.hideNumber).toBe(true);
    expect(survey.data).toEqual({});
    expect(shouldHideFileQuestions(survey)).toBe(true);
    expect(shouldHideFileQuestions(createSurvey(false))).toBe(false);

    // Never in the form builder
    survey.setDesignMode(true);
    expect(shouldHideFileQuestions(survey)).toBe(false);
  });

  it('renders the component, hides the rendered file questions and follows file changes', () => {
    const survey = createSurvey(true);
    const question = survey.getQuestionByName(
      'management'
    ) as FilesManagementQuestion;
    const attachments = survey.getQuestionByName('attachments');
    const row = document.createElement('div');
    row.className = 'sd-row';
    row.innerHTML = `<div><div class="sd-question" id="${attachments.id}"></div></div>`;
    document.body.appendChild(row);
    const element = document.createElement('div');
    element.innerHTML = '<div class="sd-question__content"></div>';
    document.body.appendChild(element);
    const customQuestion = ComponentCollection.Instance.getCustomQuestionByName(
      FILES_MANAGEMENT_QUESTION_TYPE
    ) as any;

    customQuestion.json.onAfterRender(question, element);

    const ref = appended[0];
    expect(ref.instance.survey).toBe(survey);
    expect(ref.instance.question).toBe(question);
    expect(ref.instance.refresh).toHaveBeenCalledTimes(1);
    expect(row.firstElementChild?.classList).toContain(
      FILE_QUESTION_HIDDEN_CLASS
    );

    survey.setValue('attachments', [{ name: 'a.png', content: 'data:x' }]);
    expect(ref.instance.refresh).toHaveBeenCalledTimes(2);

    // Hiding the management question by logic shows the file questions again
    question.visible = false;
    expect(row.firstElementChild?.classList).not.toContain(
      FILE_QUESTION_HIDDEN_CLASS
    );

    survey.dispose();
    expect(domService.removeComponentFromBody).toHaveBeenCalledWith(ref);
  });

  it('follows a bulk data load, which does not fire onValueChanged', () => {
    const survey = createSurvey(false);
    const question = survey.getQuestionByName(
      'management'
    ) as FilesManagementQuestion;
    const element = document.createElement('div');
    element.innerHTML = '<div class="sd-question__content"></div>';
    const customQuestion = ComponentCollection.Instance.getCustomQuestionByName(
      FILES_MANAGEMENT_QUESTION_TYPE
    ) as any;

    customQuestion.json.onAfterRender(question, element);
    const ref = appended[0];
    expect(ref.instance.refresh).toHaveBeenCalledTimes(1);

    // A draft record loaded once the form is rendered assigns survey.data
    survey.data = {
      attachments: [
        { name: 'draft.png', content: 'form-id/blob', draft: true },
      ],
    };
    expect(ref.instance.refresh).toHaveBeenCalledTimes(2);

    survey.clear();
    expect(ref.instance.refresh).toHaveBeenCalledTimes(3);

    // A replaced component no longer follows the files
    customQuestion.json.onAfterRender(question, element);
    survey.data = { attachments: [{ name: 'a.png', content: 'data:x' }] };
    expect(ref.instance.refresh).toHaveBeenCalledTimes(3);
    expect(appended[1].instance.refresh).toHaveBeenCalledTimes(2);
    survey.dispose();
  });
});
