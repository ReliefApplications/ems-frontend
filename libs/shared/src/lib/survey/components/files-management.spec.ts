import { ComponentRef, Injector } from '@angular/core';
import { ComponentCollection, SurveyModel } from 'survey-core';
import { DomService } from '../../services/dom/dom.service';
import {
  FILES_MANAGEMENT_ALLOWED_PROPERTIES,
  FILES_MANAGEMENT_QUESTION_TYPE,
  FilesManagementQuestion,
  init,
} from './files-management';
import {
  FILE_QUESTION_HIDDEN_CLASS,
  shouldHideFileQuestions,
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
    ['title', 'description', 'tooltip', 'hideFileQuestions'].forEach(
      (property) =>
        expect(FILES_MANAGEMENT_ALLOWED_PROPERTIES).toContain(property)
    );
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
});
