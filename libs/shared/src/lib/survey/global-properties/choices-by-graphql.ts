import {
  ItemValue,
  JsonMetadata,
  Question,
  Serializer,
  SurveyModel,
} from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { HttpClient } from '@angular/common/http';
import get from 'lodash/get';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import jsonpath from 'jsonpath';
import graphQLVariables from './graphql-variables';
import { isArray, isEqual, isNil } from 'lodash';
import transformGraphQLVariables from '../../utils/reference-data/transform-graphql-variables.util';

/** Question Settings category */
const category = 'Choices by GraphQL';
/** Question type ( includes dropdown & tagbox ) */
const questionType = 'selectBase';
/** GraphQL prefix */
const prefix = 'gql';

/**
 * Check if a question is of select type
 *
 * @param question The question to check
 * @returns A boolean indicating if the question is a select type
 */
const isSelectQuestion = (question: Question): boolean =>
  Serializer.isDescendantOf(question.getType(), 'selectbase');

/**
 * Updates the question value
 *
 * @param question surveyjs question
 * @param choices choices from the question
 */
const setQuestionValue = (question: Question, choices: ItemValue[]) => {
  const value = question.value;
  if (question.getType() === 'tagbox') {
    if (isArray(value)) {
      const updatedValue = choices
        .filter((choice) => value.find((x) => isEqual(x, choice.value)))
        .map((choice) => choice.value);
      question.value = updatedValue;
      // as question value may be updated before display
      if (question._instance) {
        question._instance.value = updatedValue;
      }
    }
  }
  if (question.getType() === 'dropdown') {
    if (value) {
      const updatedValue = choices.find((choice) =>
        isEqual(value, choice.value)
      )?.value;
      if (!isNil(updatedValue)) {
        question.value = updatedValue;
      } else {
        question.value = undefined;
      }
    }
  }
};

/**
 * Missing:
 * - use graphQL nested property
 */

/**
 * Initialize choices by graphql properties.
 */
export const init = (): void => {
  // declare the serializer
  const serializer: JsonMetadata = Serializer;

  let visibleIndex = 0;

  serializer.addProperty(questionType, {
    name: `${prefix}Url:string`,
    displayName: 'Service URL',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}Query`,
    displayName: 'GraphQL Query',
    category,
    type: CustomPropertyGridComponentTypes.queryEditor,
    visibleIndex: (visibleIndex += 1),
  });

  registerCustomPropertyEditor(CustomPropertyGridComponentTypes.queryEditor);

  serializer.addProperty(questionType, {
    name: `${prefix}Path:string`,
    displayName: 'Path to data within the service',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}ValueName:string`,
    displayName: 'Get values from the following JSON field',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}TitleName:string`,
    displayName: 'Get display texts from the following JSON field',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}VariableMapping`,
    displayName: 'GraphQL variables',
    category,
    type: CustomPropertyGridComponentTypes.jsonEditor,
    visibleIndex: (visibleIndex += 1),
  });

  registerCustomPropertyEditor(CustomPropertyGridComponentTypes.jsonEditor);
};

/**
 * Render the custom properties
 *
 * @param questionElement Current question
 * @param http Http client
 */
export const render = (questionElement: Question, http: HttpClient): void => {
  // Create a new subject in the question
  // Subject will close the http post request when choices are fetched, to prevent wrong choices to be visible
  if (!questionElement.refresh$) {
    questionElement.refresh$ = new Subject();
  }
  if (isSelectQuestion(questionElement)) {
    const updateChoices = async () => {
      questionElement.refresh$.next();
      if (questionElement._instance) {
        questionElement._instance.loading = true;
        questionElement._instance.disabled = true;
        questionElement._instance.toggle(false);
      }
      const valueName = get(questionElement, `${prefix}ValueName`);
      const titleName = get(questionElement, `${prefix}TitleName`);
      const variables = graphQLVariables(
        questionElement,
        `${prefix}VariableMapping`
      );
      // Transform variables to make sure JSON can be passed
      transformGraphQLVariables(
        get(questionElement, `${prefix}Query`),
        variables
      );
      // const token = localStorage.getItem('idtoken');
      firstValueFrom(
        http
          .post(
            get(questionElement, `${prefix}Url`),
            {
              query: get(questionElement, `${prefix}Query`),
              variables,
            }
            // { headers: { Authorization: `Bearer ${token}` } }
          )
          // Cancel the request when refreshing
          .pipe(takeUntil(questionElement.refresh$))
      )
        .then((result) => {
          questionElement.setPropertyValue(
            '_graphQLVariables',
            graphQLVariables(questionElement, `${prefix}VariableMapping`)
          );
          // this is to avoid that the choices appear on the 'choices' tab
          // and also to avoid the choices being sent to the server
          questionElement.choices = [];
          const choices = jsonpath
            .query(result, get(questionElement, `${prefix}Path`))
            .map((x) => ({
              value: get(x, valueName),
              text: get(x, titleName),
            }));
          const choiceItems = choices.map((choice) => new ItemValue(choice));
          questionElement.setPropertyValue('visibleChoices', choiceItems);
          // Should remove items that are not part anymore of the list of available choices
          setQuestionValue(
            questionElement,
            questionElement.getPropertyValue('visibleChoices')
          );
        })
        .finally(() => {
          if (questionElement._instance) {
            const isDisplay =
              (questionElement.survey as SurveyModel).mode === 'display';
            questionElement._instance.loading = false;
            questionElement._instance.readonly =
              isDisplay || questionElement.readOnly;
            questionElement._instance.disabled =
              isDisplay || questionElement.readOnly;
          }
        });
    };

    if (
      get(questionElement, `${prefix}Url`) &&
      get(questionElement, `${prefix}Query`)
    ) {
      updateChoices();
    }

    // Init linked reference data questions update inside the survey if those question types exists
    const containsLinkedReferenceDataQuestions = (
      questionElement.survey as SurveyModel
    )
      .getAllQuestions()
      .find((qu) => qu[`${prefix}VariableMapping`]);
    if (containsLinkedReferenceDataQuestions) {
      (questionElement.survey as SurveyModel).onValueChanged.add(async () => {
        // For the reference data questions in the survey we distinguish two levels of update that could be related but not necessarily related
        //
        // 1. The available choices(visibleChoices property). This has to be updated if the reference data question that it's dependant on has a new value set
        // 2. The selected choices in the question. If the question's selected choices should be updated/cleared if the dependant reference data question changes it's value.
        //
        // As this two update methods could work on their own specific terms, we have one property for each action to handle:
        // - [`${prefix}variableMapping`]
        // Added a few other checks, making sure that the question exists
        if (
          questionElement.visible &&
          questionElement._instance &&
          questionElement[`${prefix}VariableMapping`] &&
          questionElement[`${prefix}VariableMapping`] != '{}' &&
          !isEqual(
            questionElement._graphQLVariables,
            graphQLVariables(questionElement, `${prefix}VariableMapping`)
          )
        ) {
          questionElement.setPropertyValue(
            '_graphQLVariables',
            graphQLVariables(questionElement, `${prefix}VariableMapping`)
          );
          updateChoices();
        }
      });
    }

    (questionElement.survey as SurveyModel).onValueChanged.add(() => {
      if (
        get(questionElement, `${prefix}Url`) &&
        get(questionElement, `${prefix}Query`)
      )
        setQuestionValue(
          questionElement,
          questionElement.getPropertyValue('visibleChoices')
        );
    });
  }
};
