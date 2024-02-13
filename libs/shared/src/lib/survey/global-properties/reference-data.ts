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
import {
  get,
  has,
  isArray,
  isEmpty,
  isEqual,
  isNil,
  isObject,
  isString,
  mapValues,
  omit,
} from 'lodash';

/**
 * Sets the choices on the default value modal editor for a reference data dropdown
 *
 * @param sender The sender survey
 * @param options The options
 */
export const updateModalChoicesAndValue = (sender: any, options: any) => {
  if (options.obj.visibleChoices?.length > 0) {
    // Populate editor choices from actual question choices
    console.log(options.popupEditor);
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

    const removeEmptyPlaceholders = (obj: any) => {
      for (const key in obj) {
        if (has(obj, key)) {
          if (isArray(obj[key])) {
            // If the value is an array, recursively parse each element
            obj[key].forEach((element: any) => {
              removeEmptyPlaceholders(element);
            });
            obj[key] = obj[key].filter((element: any) =>
              isObject(element) ? !isEmpty(element) : true
            );
          } else if (isObject(obj[key])) {
            // Recursively call the function for nested objects
            removeEmptyPlaceholders(obj[key]);
          } else if (
            isString(obj[key]) &&
            obj[key].startsWith('{{') &&
            obj[key].endsWith('}}')
          ) {
            delete obj[key];
          }
        }
      }
    };

    /**
     * Parse JSON values of object.
     *
     * @param obj object to transform
     * @returns object, where string properties that can be transformed to objects, are returned as objects
     */
    const parseJSONValues = (obj: any): any => {
      if (isArray(obj)) {
        return obj.map((element: any) => parseJSONValues(element));
      }
      return mapValues(obj, (value: any) => {
        if (isString(value)) {
          try {
            return isObject(JSON.parse(value)) ? JSON.parse(value) : value;
          } catch (error) {
            // If parsing fails, return the original string value
            return value;
          }
        } else if (isArray(value)) {
          // If the value is an array, recursively parse each element
          return value.map((element: any) => parseJSONValues(element));
        } else if (isObject(value)) {
          // If the value is an object, recursively parse it
          return parseJSONValues(value);
        } else {
          // If the value is neither a string nor an object, return it as is
          return value;
        }
      });
    };

    const replaceValues = (object: any, data: any): any => {
      const regex = /["']?{{(.*?)}}["']?/;
      if (isEmpty(data)) {
        return parseJSONValues(object);
      }
      // Transform all string fields into object ones when possible
      const objectAsJSON = parseJSONValues(object);
      const toString = JSON.stringify(objectAsJSON);
      const replaced = toString.replace(new RegExp(regex, 'g'), (match) => {
        const field = match.replace(/["']?\{\{/, '').replace(/\}\}["']?/, '');
        const fieldValue = get(data, field);
        return isNil(fieldValue) ? match : JSON.stringify(fieldValue);
      });
      const parsed = JSON.parse(replaced);
      return parsed;
    };

    const graphQLVariables = () => {
      try {
        console.log(question.referenceDataVariableMapping);
        let mapping = JSON.parse(question.referenceDataVariableMapping || '');
        console.log(get(question, 'survey.data'));
        mapping = replaceValues(mapping, get(question, 'survey.data'));
        removeEmptyPlaceholders(mapping);
        return mapping;
      } catch {
        return {};
      }
    };

    const updateChoices = () => {
      if (question.referenceData && question.referenceDataDisplayField) {
        referenceDataService
          .getChoices(
            question.referenceData,
            question.referenceDataDisplayField,
            question.isPrimitiveValue,
            graphQLVariables()
          )
          .then((choices) => {
            // this is to avoid that the choices appear on the 'choices' tab
            // and also to avoid the choices being sent to the server
            question.choices = [];

            const choiceItems = choices.map((choice) => new ItemValue(choice));
            question.setPropertyValue('visibleChoices', choiceItems);
            // manually set the selected option (not done by default)
            // only affects dropdown questions (only one option selected) with reference data and non primitive values
            if (
              !question.isPrimitiveValue &&
              question.getType() === 'dropdown'
            ) {
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
            if (question.getType() === 'tagbox') {
              if (question.isPrimitiveValue) {
                console.log(question.name);
                console.log(question.value);
                // question.setPropertyValue(
                //   'value',
                //   choiceItems
                //     .filter((choice) =>
                //       question.value.find((x: any) => isEqual(choice.id, x))
                //     )
                //     .map((x) => x.id)
                // );
                question.value = choiceItems
                  .filter((choice) =>
                    question.value.find((x: any) => isEqual(choice.id, x))
                  )
                  .map((x) => x.id);
                // question.value = choiceItems
                //   .filter((choice) =>
                //     question.value.find((x: any) => isEqual(choice.id, x))
                //   )
                //   .map((x) => x.id);
                console.log(
                  'Et voila : ',
                  choiceItems
                    .filter((choice) =>
                      question.value.find((x: any) => isEqual(choice.id, x))
                    )
                    .map((x) => x.id)
                );
              }
            }
            if (question.getType() === 'dropdown') {
              if (question.isPrimitiveValue) {
                console.log(question.name);
                question.value = choiceItems.find((choice) =>
                  isEqual(choice.id, question.value)
                )?.id;
              }
            }
          });
      } else {
        question.choices = [];
      }
    };

    // init the choices
    if (!question.referenceDataChoicesLoaded && question.referenceData) {
      referenceDataService
        .cacheItems(question.referenceData, graphQLVariables())
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

    (question.survey as SurveyModel).onValueChanged.add(() => {
      console.log('survey value is changing');
      if (question.referenceDataVariableMapping) {
        updateChoices();
      }
    });
  }
};
