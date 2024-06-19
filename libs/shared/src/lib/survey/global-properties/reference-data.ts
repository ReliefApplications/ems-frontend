import {
  QuestionSelectBase,
  Question,
  CustomMatrixDropdownColumn,
} from '../types';
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
import { isEqual, isNil, omit } from 'lodash';

/**
 * Sets the choices on the default value modal editor for a reference data dropdown
 *
 * @param sender The sender survey
 * @param options The options
 */
export const updateModalChoicesAndValue = (sender: any, options: any) => {
  if (options.obj.visibleChoices?.length > 0) {
    // Populate editor choices from actual question choices
    options.popupEditor.question.setPropertyValue(
      'choices',
      options.obj.visibleChoices
    );

    if (isNil(options.obj.defaultValue)) {
      return;
    }

    // Set default value if exists
    options.popupEditor.question.setPropertyValue(
      'value',
      options.obj.isPrimitiveValue
        ? options.obj.defaultValue
        : // Gets rid of surveyJS pos artifact
          omit(new ItemValue(options.obj.defaultValue).id as any, 'pos')
    );
  }
};

/**
 * Check if a question is of select type
 *
 * @param question The question to check
 * @returns A boolean indicating if the question is a select type
 */
export const isSelectQuestion = (question: Question): boolean =>
  Serializer.isDescendantOf(question.getType(), 'selectbase');

/**
 * Check if a question is of select type
 *
 * @param question The question to check
 * @returns A boolean indicating if the question is a matrixdropdowncolumn type
 */
export const isMatrixDropdownQuestion = (question: Question): boolean =>
  Serializer.isDescendantOf(question.getType(), 'matrixdropdown');

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
      isRequired: true,
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
              choicesCallback(
                referenceData.fields?.map((x) => x?.name ?? x) || []
              )
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
      isRequired: true,
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
                choicesCallback(
                  referenceData.fields?.map((x) => x?.name ?? x) || []
                )
              );
          }
        }
      },
    });

    serializer.addProperty(type, {
      displayName: 'Filter condition',
      name: 'referenceDataFilterFilterCondition',
      category: 'Choices from Reference data',
      isRequired: true,
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
      isRequired: true,
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
              choicesCallback(
                referenceData.fields?.map((x) => x?.name ?? x) || []
              )
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
  const updateChoices = (question: Question, element: any) => {
    if (element.referenceData && element.referenceDataDisplayField) {
      let filter;
      // create a filter object if all required properties for filtering are set
      if (
        element.referenceDataFilterFilterFromQuestion &&
        element.referenceDataFilterForeignField &&
        element.referenceDataFilterFilterCondition &&
        element.referenceDataFilterLocalField
      ) {
        const foreign = (question.survey as SurveyModel)
          .getAllQuestions()
          .find(
            (x: any) => x.name === element.referenceDataFilterFilterFromQuestion
          ) as QuestionSelectBase;
        if (foreign.referenceData && !!foreign.value) {
          filter = {
            foreignReferenceData: foreign.referenceData,
            foreignField: element.referenceDataFilterForeignField,
            foreignValue: foreign.value,
            localField: element.referenceDataFilterLocalField,
            operator: element.referenceDataFilterFilterCondition,
          };
        }
      }
      referenceDataService
        .getChoices(
          element.referenceData,
          element.referenceDataDisplayField,
          element.isPrimitiveValue,
          filter
        )
        .then((choices) => {
          // this is to avoid that the choices appear on the 'choices' tab
          // and also to avoid the choices being sent to the server
          element.choices = [];

          const choiceItems = choices.map((choice) => new ItemValue(choice));
          element.setPropertyValue('visibleChoices', choiceItems);
          element.setPropertyValue('choices', choiceItems);
          // manually set the selected option (not done by default)
          // only affects dropdown questions (only one option selected) with reference data and non primitive values
          if (
            !element.isPrimitiveValue &&
            (element.getType() === 'dropdown' ||
              element.getType() === 'matrixdropdowncolumn')
          ) {
            // When using dashboard filters, the element.value object is truncated
            if (isEqual(element.value, element.defaultValue?.value)) {
              return (element.value = element.defaultValue);
            }

            // First, if no value, we try to get the default value
            element.value = element.value ?? element.defaultValue;

            // We then create an ItemValue from the value
            const valueItem = new ItemValue(element.value);

            // Then, we try to find the value in the choices by comparing the ids
            element.value = choiceItems.find((choice) =>
              isEqual(choice.id, omit(valueItem.id as any, 'pos'))
            );
          }
        });
    } else {
      element.choices = [];
    }
  };

  const initChoices = (question: Question, element: any) => {
    // look on changes
    element.registerFunctionOnPropertyValueChanged(
      'referenceData',
      (value: string) => {
        element.referenceDataDisplayField = undefined;
        if (!value) {
          element.referenceDataDisplayField = undefined;
          element.referenceDataFilterFilterFromQuestion = undefined;
          element.referenceDataFilterForeignField = undefined;
          element.referenceDataFilterFilterCondition = undefined;
          element.referenceDataFilterLocalField = undefined;
        }
      }
    );
    element.registerFunctionOnPropertyValueChanged(
      'isPrimitiveValue',
      updateChoices(question, element)
    );
    element.registerFunctionOnPropertyValueChanged(
      'referenceDataDisplayField',
      updateChoices(question, element)
    );

    // Look for foreign question changes if needed for filter
    const foreignQuestion = (question.survey as SurveyModel)
      .getAllQuestions()
      .find(
        (x: any) => x.name === element.referenceDataFilterFilterFromQuestion
      ) as QuestionSelectBase | undefined;
    foreignQuestion?.registerFunctionOnPropertyValueChanged(
      'value',
      updateChoices(question, element)
    );
  };

  if (isSelectQuestion(questionElement) && questionElement.referenceData) {
    const question = questionElement as QuestionSelectBase;

    if (!question.referenceDataChoicesLoaded && question.referenceData) {
      referenceDataService
        .cacheItems(question.referenceData)
        .then(() => updateChoices(question, question));
      question.referenceDataChoicesLoaded = true;
    }
    // Prevent selected choices to be removed when sending the value
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    question.clearIncorrectValuesCallback = () => {};
    initChoices(question, question);
  } else if (isMatrixDropdownQuestion(questionElement)) {
    const visibleColumns = questionElement.visibleColumns;
    // init the choices
    visibleColumns.forEach((column: CustomMatrixDropdownColumn) => {
      if (!column.referenceDataChoicesLoaded && column.referenceData) {
        referenceDataService
          .cacheItems(column.referenceData)
          .then(() => updateChoices(questionElement, column));
        column.referenceDataChoicesLoaded = true;
      }

      initChoices(questionElement, column);
    });
  }
};
