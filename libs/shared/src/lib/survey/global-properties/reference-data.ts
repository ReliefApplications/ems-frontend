import { QuestionSelectBase, Question } from '../types';
import {
  ChoicesRestfull,
  ItemValue,
  JsonMetadata,
  Serializer,
  SurveyModel,
  // surveyLocalization,
} from 'survey-core';
import { ReferenceDataService } from '../../services/reference-data/reference-data.service';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { get, isArray, isEqual, isNil, omit } from 'lodash';
import graphQLVariables from './graphql-variables';

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
        obj.setPropertyValue('referenceDataVariableMapping', '');
        obj.setPropertyValue('choicesByUrl', new ChoicesRestfull());
        obj.choicesByUrl.setData([]);
        obj.setPropertyValue('referenceData', value);
        obj.setPropertyValue('_referenceData', null);
      },
    });

    registerCustomPropertyEditor(
      CustomPropertyGridComponentTypes.referenceDataDropdown
    );

    serializer.addProperty(type, {
      name: '_referenceData',
      category: 'Choices from Reference data',
      visible: false,
      isSerializable: false,
    });

    serializer.addProperty(type, {
      name: '_graphQLVariables',
      category: 'Choices from Reference data',
      visible: false,
      isSerializable: false,
    });

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
            .then((referenceData) => {
              obj.setPropertyValue('_referenceData', referenceData);
              choicesCallback(
                referenceData.fields?.map((x) => x?.name ?? x) || []
              );
            });
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
      displayName: 'GraphQL variables',
      name: 'referenceDataVariableMapping',
      category: 'Choices from Reference data',
      type: CustomPropertyGridComponentTypes.codeEditor,
      dependsOn: '_referenceData',
      visibleIndex: 4,
      visibleIf: (obj: null | QuestionSelectBase): boolean => {
        return Boolean(obj?._referenceData);
      },
    });

    registerCustomPropertyEditor(CustomPropertyGridComponentTypes.codeEditor);
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

    const updateChoices = async () => {
      if (question.referenceData && question.referenceDataDisplayField) {
        const choices = await referenceDataService.getChoices(
          question.referenceData,
          question.referenceDataDisplayField,
          question.isPrimitiveValue,
          graphQLVariables(question, 'referenceDataVariableMapping')
        );
        question.setPropertyValue(
          '_graphQLVariables',
          graphQLVariables(question, 'referenceDataVariableMapping')
        );
        // this is to avoid that the choices appear on the 'choices' tab
        // and also to avoid the choices being sent to the server
        question.choices = [];

        const choiceItems = choices.map((choice) => new ItemValue(choice));
        question.setPropertyValue('visibleChoices', choiceItems);
        // manually set the selected option (not done by default)
        // only affects dropdown questions (only one option selected) with reference data and non primitive values
        if (!question.isPrimitiveValue && question.getType() === 'dropdown') {
          // When using dashboard filters, the question.value object is truncated
          if (isEqual(question.value, question.defaultValue?.value)) {
            return (question.value = question.defaultValue);
          }

          // First, if no value, we try to get the default value
          question.value = question.value ?? question.defaultValue;

          // We then create an ItemValue from the value
          const valueItem = new ItemValue(question.value);

          // Then, we try to find the value in the choices by comparing the ids
          question.value = choiceItems.find((choice) =>
            isEqual(choice.id, omit(valueItem.id as any, 'pos'))
          );
        }
      } else {
        question.choices = [];
      }
    };

    const updateSelectedChoices = () => {
      const valueField = question._referenceData.valueField;
      const choiceItems: ItemValue[] = question.visibleChoices;
      // Handle tagbox changes
      if (question.getType() === 'tagbox' && isArray(question.value)) {
        if (question.isPrimitiveValue) {
          question.value = choiceItems
            .filter((choice) =>
              question.value.find((x: any) => isEqual(choice.value, x))
            )
            .map((x) => x.value);
        } else {
          question.value = choiceItems
            .filter((choice) =>
              question.value.find((x: any) =>
                isEqual(choice.value[valueField], x.value[valueField])
              )
            )
            .map((choice) => ({
              text: choice.text,
              value: choice.value,
            }));
        }
        question._instance.value = question.value;
      }
      // Handle dropdown changes
      if (question.getType() === 'dropdown' && question.value) {
        if (question.isPrimitiveValue) {
          question.value = choiceItems.find((choice) =>
            isEqual(choice.value, question.value)
          )?.value;
        } else {
          const choice = choiceItems.find((choice) =>
            isEqual(
              choice.value[valueField],
              get(question.value, `value.${valueField}`)
            )
          );
          question.value = choice
            ? { text: choice.text, value: choice.value }
            : undefined;
        }
      }
    };

    // init the choices
    if (!question.referenceDataChoicesLoaded && question.referenceData) {
      referenceDataService
        .loadReferenceData(question.referenceData)
        .then((referenceData) => {
          question.setPropertyValue('_referenceData', referenceData);
          referenceDataService
            .cacheItems(
              referenceData,
              graphQLVariables(question, 'referenceDataVariableMapping')
            )
            .then(() => updateChoices());
        });
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
    // Init linked reference data questions update inside the survey if those question types exists
    const containsLinkedReferenceDataQuestions = (
      question.survey as SurveyModel
    )
      .getAllQuestions()
      .find((qu) => qu.referenceDataVariableMapping);
    if (containsLinkedReferenceDataQuestions) {
      (question.survey as SurveyModel).onValueChanged.add(async () => {
        // For the reference data questions in the survey we distinguish two levels of update that could be related but not necessarily related
        //
        // 1. The available choices(visibleChoices property). This has to be updated if the reference data question that it's dependant on has a new value set
        // 2. The selected choices in the question. If the question's selected choices should be updated/cleared if the dependant reference data question changes it's value.
        //
        // As this two update methods could work on their own specific terms, we have one property for each action to handle:
        // - referenceDataVariableMapping

        if (
          question.referenceDataVariableMapping &&
          question.referenceDataVariableMapping != '{}' &&
          !isEqual(
            question._graphQLVariables,
            graphQLVariables(question, 'referenceDataVariableMapping')
          )
        ) {
          question.setPropertyValue(
            '_graphQLVariables',
            graphQLVariables(question, 'referenceDataVariableMapping')
          );
          question._instance.loading = true;
          question._instance.disabled = true;
          await updateChoices();
          question._instance.loading = false;
          question._instance.disabled = question.readOnly;
          updateSelectedChoices();
        }
      });
    }
  }
};
