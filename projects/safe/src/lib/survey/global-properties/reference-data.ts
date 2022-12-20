import SurveyCreator from 'survey-creator-core';
import { JsonMetadata, SurveyModel, Serializer } from 'survey-core';
import { DomService } from '../../services/dom/dom.service';
import { SafeReferenceDataService } from '../../services/reference-data/reference-data.service';
import { SafeReferenceDataDropdownComponent } from '../../components/reference-data-dropdown/reference-data-dropdown.component';
import { Question, QuestionSelectBase } from '../types';

/**
 * Check if a question is of select type
 *
 * @param question The question to check
 * @returns A boolean indicating if the question is a select type
 */
const isSelectQuestion = (question: Question): boolean =>
  Serializer.isDescendantOf(question.getType(), 'selectbase');

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param domService Dom service.
 * @param referenceDataService Reference data service
 */
export const init = (
  Survey: any,
  domService: DomService,
  referenceDataService: SafeReferenceDataService
): void => {
  // declare the serializer
  const serializer: JsonMetadata = Survey.Serializer;

  // add properties
  serializer.addProperty('selectbase', {
    name: 'referenceData',
    category: 'Choices from Reference data',
    type: 'referenceDataDropdown',
    visibleIndex: 1,
  });

  serializer.addProperty('selectbase', {
    displayName: 'Display field',
    name: 'referenceDataDisplayField',
    category: 'Choices from Reference data',
    required: true,
    dependsOn: 'referenceData',
    visibleIf: (obj: null | QuestionSelectBase): boolean =>
      Boolean(obj?.referenceData),
    visibleIndex: 2,
    choices: (
      obj: null | QuestionSelectBase,
      choicesCallback: (choices: any[]) => void
    ) => {
      if (obj?.referenceData) {
        referenceDataService
          .loadReferenceData(obj.referenceData)
          .then((referenceData) => choicesCallback(referenceData.fields || []));
      }
    },
  });

  serializer.addProperty('selectbase', {
    displayName: 'Filter from question',
    name: 'referenceDataFilterFilterFromQuestion',
    type: 'dropdown',
    category: 'Choices from Reference data',
    dependsOn: 'referenceData',
    visibleIf: (obj: null | QuestionSelectBase): boolean =>
      Boolean(obj?.referenceData),
    visibleIndex: 3,
    choices: (
      obj: null | QuestionSelectBase,
      choicesCallback: (choices: any[]) => void
    ) => {
      const defaultOption = new Survey.ItemValue(
        '',
        SurveyCreator.localization.getString('pe.conditionSelectQuestion')
      );
      const survey = obj?.survey as SurveyModel;
      if (!survey) return choicesCallback([defaultOption]);
      const questions = survey
        .getAllQuestions()
        .filter((question) => isSelectQuestion(question) && question !== obj)
        .map((question) => question as QuestionSelectBase)
        .filter((question) => question.referenceData);
      const qItems = questions.map((q) => {
        const text = q.locTitle.renderedHtml || q.name;
        return new Survey.ItemValue(q.name, text);
      });
      qItems.sort((el1, el2) => el1.text.localeCompare(el2.text));
      qItems.unshift(defaultOption);
      choicesCallback(qItems);
    },
  });

  serializer.addProperty('selectbase', {
    displayName: 'Foreign field',
    name: 'referenceDataFilterForeignField',
    category: 'Choices from Reference data',
    required: true,
    dependsOn: 'referenceDataFilterFilterFromQuestion',
    visibleIf: (obj: null | QuestionSelectBase): boolean =>
      Boolean(obj?.referenceDataFilterFilterFromQuestion),
    visibleIndex: 4,
    choices: (
      obj: null | QuestionSelectBase,
      choicesCallback: (choices: any[]) => void
    ) => {
      if (obj?.referenceDataFilterFilterFromQuestion) {
        const foreignQuestion = (obj.survey as SurveyModel)
          .getAllQuestions()
          .find((q) => q.name === obj.referenceDataFilterFilterFromQuestion) as
          | QuestionSelectBase
          | undefined;
        if (foreignQuestion?.referenceData) {
          referenceDataService
            .loadReferenceData(foreignQuestion.referenceData)
            .then((referenceData) =>
              choicesCallback(referenceData.fields || [])
            );
        }
      }
    },
  });

  serializer.addProperty('selectbase', {
    displayName: 'Filter condition',
    name: 'referenceDataFilterFilterCondition',
    category: 'Choices from Reference data',
    required: true,
    dependsOn: 'referenceDataFilterFilterFromQuestion',
    visibleIf: (obj: null | QuestionSelectBase): boolean =>
      Boolean(obj?.referenceDataFilterFilterFromQuestion),
    visibleIndex: 5,
    choices: [
      { value: 'eq', text: '==' },
      { value: 'neq', text: '!=' },
      { value: 'gte', text: '>=' },
      { value: 'gt', text: '>' },
      { value: 'lte', text: '<=' },
      { value: 'lt', text: '<' },
      { value: 'contains', text: 'contains' },
      { value: 'doesnotcontain', text: 'does not contain' },
      { value: 'iscontained', text: 'is contained in' },
      { value: 'isnotcontained', text: 'is not contained in' },
    ],
  });

  serializer.addProperty('selectbase', {
    displayName: 'Local field',
    name: 'referenceDataFilterLocalField',
    category: 'Choices from Reference data',
    required: true,
    dependsOn: 'referenceDataFilterFilterFromQuestion',
    visibleIf: (obj: null | QuestionSelectBase): boolean =>
      Boolean(obj?.referenceDataFilterFilterFromQuestion),
    visibleIndex: 6,
    choices: (
      obj: null | QuestionSelectBase,
      choicesCallback: (choices: any[]) => void
    ) => {
      if (obj?.referenceData) {
        referenceDataService
          .loadReferenceData(obj.referenceData)
          .then((referenceData) => choicesCallback(referenceData.fields || []));
      }
    },
  });

  // custom editor for the reference data dropdown
  const referenceDataEditor = {
    render: (editor: any, htmlElement: HTMLElement) => {
      const question = editor.object as QuestionSelectBase;
      const dropdown = domService.appendComponentToBody(
        SafeReferenceDataDropdownComponent,
        htmlElement
      );
      const instance: SafeReferenceDataDropdownComponent = dropdown.instance;
      instance.referenceData = question.referenceData || '';
      instance.choice.subscribe((res) => editor.onChanged(res));
    },
  };
  SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
    'referenceDataDropdown',
    referenceDataEditor
  );
};

/**
 * Render the custom properties
 *
 * @param questionElement The question element
 * @param referenceDataService The reference data service
 */
export const render = (
  questionElement: Question,
  referenceDataService: SafeReferenceDataService
): void => {
  if (isSelectQuestion(questionElement)) {
    const question = questionElement as QuestionSelectBase;

    const updateChoices = () => {
      if (question.referenceData && question.referenceDataDisplayField) {
        let filter;
        // create a filter object if all required properties for filtering are set
        if (
          question.referenceDataFilterFilterFromQuestion &&
          question.referenceDataFilterForeignField &&
          question.referenceDataFilterFilterCondition &&
          question.referenceDataFilterLocalField
        ) {
          const foreign = (question.survey as SurveyModel)
            .getAllQuestions()
            .find(
              (x: any) =>
                x.name === question.referenceDataFilterFilterFromQuestion
            ) as QuestionSelectBase;
          if (foreign.referenceData && !!foreign.value) {
            filter = {
              foreignReferenceData: foreign.referenceData,
              foreignField: question.referenceDataFilterForeignField,
              foreignValue: foreign.value,
              localField: question.referenceDataFilterLocalField,
              operator: question.referenceDataFilterFilterCondition,
            };
          }
        }
        referenceDataService
          .getChoices(
            question.referenceData,
            question.referenceDataDisplayField,
            filter
          )
          .then((choices) => {
            question.choices = choices;
          });
      } else {
        question.choices = [];
      }
    };

    // init the choices
    if (!question.referenceDataChoicesLoaded && question.referenceData) {
      referenceDataService
        .cacheItems(question.referenceData)
        .then(() => updateChoices());
      question.referenceDataChoicesLoaded = true;
    }
    // look on changes
    question.registerFunctionOnPropertyValueChanged(
      'referenceData',
      (value: string) => {
        question.referenceDataDisplayField = undefined;
        if (!value) {
          question.referenceDataDisplayField = undefined;
          question.referenceDataFilterFilterFromQuestion = undefined;
          question.referenceDataFilterForeignField = undefined;
          question.referenceDataFilterFilterCondition = undefined;
          question.referenceDataFilterLocalField = undefined;
        }
      }
    );
    question.registerFunctionOnPropertyValueChanged(
      'referenceDataDisplayField',
      updateChoices
    );

    // Look for foreign question changes if needed for filter
    const foreignQuestion = (question.survey as SurveyModel)
      .getAllQuestions()
      .find(
        (x: any) => x.name === question.referenceDataFilterFilterFromQuestion
      ) as QuestionSelectBase | undefined;
    foreignQuestion?.registerFunctionOnPropertyValueChanged(
      'value',
      updateChoices
    );
  }
};
