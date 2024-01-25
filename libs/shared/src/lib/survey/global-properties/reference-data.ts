import { QuestionSelectBase, Question } from '../types';
import {
  ChoicesRestfull,
  ItemValue,
  JsonMetadata,
  Serializer,
  SurveyModel,
  surveyLocalization,
} from 'survey-core';
import { ReferenceDataService } from '../../services/reference-data/reference-data.service';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { isEqual } from 'lodash';

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
 * @param referenceDataService Reference data service
 */
export const init = (referenceDataService: ReferenceDataService): void => {
  // declare the serializer
  const serializer: JsonMetadata = Serializer;

  // Hide the choices from the property grid if choices from reference data is used
  serializer.getProperty('selectbase', 'choices').visibleIf = (
    obj: Question
  ): boolean => !obj.referenceData;

  for (const type of ['tagbox', 'dropdown']) {
    // add properties
    serializer.addProperty(type, {
      name: 'referenceData',
      category: 'Choices from Reference data',
      type: CustomPropertyGridComponentTypes.referenceDataDropdown,
      visibleIndex: 1,
      onSetValue: (obj: QuestionSelectBase, value: string) => {
        obj.setPropertyValue('choicesByUrl', new ChoicesRestfull());
        obj.choicesByUrl.setData([]);
        obj.setPropertyValue('referenceData', value);
      },
    });

    registerCustomPropertyEditor(
      CustomPropertyGridComponentTypes.referenceDataDropdown
    );

    serializer.addProperty(type, {
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
            .then((referenceData) =>
              choicesCallback(referenceData.fields?.map((x) => x.name) || [])
            );
        }
      },
    });

    serializer.addProperty(type, {
      displayName: 'Is primitive value',
      name: 'isPrimitiveValue',
      type: 'boolean',
      category: 'Choices from Reference data',
      dependsOn: 'referenceData',
      visibleIf: (obj: null | QuestionSelectBase): boolean =>
        Boolean(obj?.referenceData),
      visibleIndex: 3,
      default: true,
    });

    serializer.addProperty(type, {
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
        const defaultOption = new ItemValue(
          '',
          surveyLocalization.getString('pe.conditionSelectQuestion')
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
          return new ItemValue(q.name, text);
        });
        qItems.sort((el1, el2) => el1.text.localeCompare(el2.text));
        qItems.unshift(defaultOption);
        choicesCallback(qItems);
      },
    });

    serializer.addProperty(type, {
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
            .find(
              (q) => q.name === obj.referenceDataFilterFilterFromQuestion
            ) as QuestionSelectBase | undefined;
          if (foreignQuestion?.referenceData) {
            referenceDataService
              .loadReferenceData(foreignQuestion.referenceData)
              .then((referenceData) =>
                choicesCallback((referenceData.fields || []).map((x) => x.name))
              );
          }
        }
      },
    });

    serializer.addProperty(type, {
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

    serializer.addProperty(type, {
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
            .then((referenceData) =>
              choicesCallback((referenceData.fields || []).map((x) => x.name))
            );
        }
      },
    });
  }
};

/**
 * Render the custom properties
 *
 * @param questionElement The question element
 * @param referenceDataService The reference data service
 */
export const render = (
  questionElement: Question,
  referenceDataService: ReferenceDataService
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
            question.isPrimitiveValue,
            filter
          )
          .then((choices) => {
            const newChoices = choices.map((choice) => new ItemValue(choice));
            question.choices = newChoices;
            question.setPropertyValue('visibleChoices', newChoices);

            // manually set the selected option (not done by default)
            // only affects dropdown questions (only one option selected) with reference data and non primitive values
            if (
              !question.isPrimitiveValue &&
              question.getType() == 'dropdown'
            ) {
              question.value = choices.find((choice) =>
                isEqual(choice.value, question.value)
              );
            }
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
    // Prevent selected choices to be removed when sending the value
    question.clearIncorrectValuesCallback = () => {
      // console.log(question.visibleChoices);
      // console.log(question.value);
    };
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
      'isPrimitiveValue',
      updateChoices
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
