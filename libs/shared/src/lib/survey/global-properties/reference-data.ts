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
      displayName: 'Keep selected choices',
      name: 'selectedChoicesNotAffectedByVisibleChoices',
      category: 'Choices from Reference data',
      type: 'boolean',
      dependsOn: '_referenceData',
      visibleIndex: 4,
      visibleIf: (obj: null | QuestionSelectBase): boolean => {
        return Boolean(obj?._referenceData);
      },
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
        // Default value get
        let fieldValue = get(data, field);
        // Check if the filter set in the graphql variables is a nested property by splitting the value in the {{}} by dots
        const recursiveField = field.split('.');
        if (recursiveField.length > 1) {
          // Get the actual non primitive value using the first position, related to the question name, e.g. countries
          fieldValue = get(data, recursiveField[0]);
          // Then build the nested path to the needed primitive data using all the other fields in the previous array except the first one, needed only to select the question data from the survey
          // taking in account that the ItemValue object is a {text, value} object type, e.g. value.id
          const dataPath = `value.${recursiveField.slice(1).join('.')}`;
          // If it's an array(tagbox), we collect all primitives and build an array
          if (Array.isArray(fieldValue)) {
            const valueHelper: any[] = [];
            fieldValue.forEach((value) => {
              const primitive = get(value, dataPath);
              valueHelper.push(primitive);
            });
            fieldValue = valueHelper;
          } else {
            fieldValue = get(fieldValue, dataPath);
          }
        }
        return isNil(fieldValue) ? match : JSON.stringify(fieldValue);
      });
      const parsed = JSON.parse(replaced);
      return parsed;
    };

    const graphQLVariables = () => {
      try {
        let mapping = JSON.parse(question.referenceDataVariableMapping || '');
        mapping = replaceValues(mapping, get(question, 'survey.data'));
        removeEmptyPlaceholders(mapping);
        return mapping;
      } catch {
        return {};
      }
    };

    const updateChoices = async () => {
      if (question.referenceData && question.referenceDataDisplayField) {
        const choices = await referenceDataService.getChoices(
          question.referenceData,
          question.referenceDataDisplayField,
          question.isPrimitiveValue,
          graphQLVariables()
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

    const getReferenceDataFilterKey = () => {
      const regExKey = new RegExp(/(?<={{).+?(?=}})/, 'gi');
      const filterKey = regExKey.exec(
        question.referenceDataVariableMapping ?? ''
      );
      return filterKey?.[0];
    };

    const updateSelectedChoices = () => {
      const choiceItems: ItemValue[] = question.visibleChoices;
      if (question.getType() === 'tagbox') {
        if (question.referenceDataVariableMapping) {
          const filterKey = getReferenceDataFilterKey();
          if (filterKey) {
            const data = get(question, 'survey.data');
            if (data[filterKey]) {
              if (question.isPrimitiveValue) {
                question.value = choiceItems
                  .filter((choice) =>
                    question.value.find((x: any) => isEqual(choice.id, x))
                  )
                  .map((x) => x.id);
              }
            } else {
              if (question.value && question.value.length) {
                question.value = [];
                question._instance.clearAll();
              }
            }
          }
        } else {
          if (question.isPrimitiveValue) {
            question.value = choiceItems
              .filter((choice) =>
                question.value.find((x: any) => isEqual(choice.id, x))
              )
              .map((x) => x.id);
          }
        }
      }
      if (question.getType() === 'dropdown') {
        if (question.referenceDataVariableMapping) {
          const filterKey = getReferenceDataFilterKey();
          if (filterKey) {
            const data = get(question, 'survey.data');
            if (data[filterKey]) {
              if (question.isPrimitiveValue) {
                question.value = choiceItems.find((choice) =>
                  isEqual(choice.id, question.value)
                )?.id;
              }
            } else {
              if (question.value) {
                question.value = null;
                question._instance.clearValue();
              }
            }
          }
        } else {
          if (question.isPrimitiveValue) {
            question.value = choiceItems.find((choice) =>
              isEqual(choice.id, question.value)
            )?.id;
          }
        }
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
    // We register the reference data question that has a new value in order to not trigger the choices and selected choices update to avoid additional checks
    question.registerFunctionOnPropertyValueChanged('value', () => {
      question.isChangeSource = true;
    });
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
        // 1. => referenceDataVariableMapping
        // 2. => selectedChoicesNotAffectedByVisibleChoices

        // If the question is not the source of the change event, then update choices and selected choices if needed
        if (!question.isChangeSource) {
          if (
            question.referenceDataVariableMapping &&
            question.referenceDataVariableMapping != '{}'
          ) {
            question._instance.loading = true;
            question._instance.disabled = true;
            await updateChoices();
            question._instance.loading = false;
            question._instance.disabled = false;
          }
          if (!question.selectedChoicesNotAffectedByVisibleChoices) {
            updateSelectedChoices();
          }
        } else {
          question.isChangeSource = false;
        }
      });
    }
  }
};
