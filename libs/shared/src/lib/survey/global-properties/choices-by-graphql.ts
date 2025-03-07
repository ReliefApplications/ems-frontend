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
import { Observable, Subject, firstValueFrom, takeUntil } from 'rxjs';
import jsonpath from 'jsonpath';
import graphQLVariables from './graphql-variables';
import { isArray, isEqual, isNil } from 'lodash';
import transformGraphQLVariables from '../../utils/reference-data/transform-graphql-variables.util';
import { Injector } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

/** Question Settings category */
const category = 'Choices by GraphQL';
/** Question type ( includes dropdown & tagbox ) */
const questionType = 'selectBase';

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
        .filter((choice) =>
          value.find((x) => isEqual(x, choice.value) || x == choice.value)
        )
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
      const updatedValue = choices.find(
        (choice) => isEqual(value, choice.value) || value == choice.value
      )?.value;
      if (!isNil(updatedValue)) {
        question.value = updatedValue;
        if (question._instance) {
          question._instance.value = updatedValue;
        }
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
    name: 'gqlUrl:string',
    displayName: 'Service URL',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: 'gqlQuery',
    displayName: 'GraphQL Query',
    category,
    type: CustomPropertyGridComponentTypes.queryEditor,
    visibleIndex: (visibleIndex += 1),
  });

  registerCustomPropertyEditor(CustomPropertyGridComponentTypes.queryEditor);

  serializer.addProperty(questionType, {
    name: 'gqlPath:string',
    displayName: 'Path to data within the service',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: 'gqlValueName:string',
    displayName: 'Get values from the following JSON field',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: 'gqlTitleName:string',
    displayName: 'Get display texts from the following JSON field',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: 'gqlVariableMapping',
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
 * @param injector Angular injector
 */
export const render = (questionElement: Question, injector: Injector): void => {
  const http = injector.get(HttpClient);
  const apollo = injector.get(Apollo);
  const environment = injector.get('environment');
  const csApiUrl = environment.csApiUrl;

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
      const valueName = get(questionElement, 'gqlValueName');
      const titleName = get(questionElement, 'gqlTitleName');

      // Build & send request
      const sendRequest = (): Promise<any> => {
        const url = get(questionElement, 'gqlUrl');
        const query = get(questionElement, 'gqlQuery');
        const variables = graphQLVariables(
          questionElement,
          'gqlVariableMapping'
        );
        // Transform variables to make sure JSON can be passed
        transformGraphQLVariables(get(questionElement, 'gqlQuery'), variables);

        let observable: Observable<any>;

        if (url.startsWith(csApiUrl)) {
          // Common Services API call
          const csApolloClient = apollo.use('csClient');
          observable = csApolloClient.query({
            query: gql`
              ${query}
            `,
            variables,
          });
        } else {
          // other API call
          observable = http.post(url, {
            query,
            variables,
          });
        }
        return firstValueFrom(
          observable.pipe(takeUntil(questionElement.refresh$))
        );
      };

      sendRequest()
        .then((result) => {
          questionElement.setPropertyValue(
            '_graphQLVariables',
            graphQLVariables(questionElement, 'gqlVariableMapping')
          );
          // this is to avoid that the choices appear on the 'choices' tab
          // and also to avoid the choices being sent to the server
          questionElement.choices = [];
          const choices = jsonpath
            .query(result, get(questionElement, 'gqlPath'))
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

    if (get(questionElement, 'gqlUrl') && get(questionElement, 'gqlQuery')) {
      updateChoices();
    }

    // Init linked reference data questions update inside the survey if those question types exists
    const containsLinkedReferenceDataQuestions = (
      questionElement.survey as SurveyModel
    )
      .getAllQuestions()
      .find((qu) => qu['gqlVariableMapping']);
    if (containsLinkedReferenceDataQuestions) {
      (questionElement.survey as SurveyModel).onValueChanged.add(async () => {
        // For the reference data questions in the survey we distinguish two levels of update that could be related but not necessarily related
        //
        // 1. The available choices(visibleChoices property). This has to be updated if the reference data question that it's dependant on has a new value set
        // 2. The selected choices in the question. If the question's selected choices should be updated/cleared if the dependant reference data question changes it's value.
        //
        // As this two update methods could work on their own specific terms, we have one property for each action to handle:
        // - ['gqlvariableMapping']
        // Added a few other checks, making sure that the question exists
        if (
          questionElement.visible &&
          questionElement._instance &&
          questionElement['gqlVariableMapping'] &&
          questionElement['gqlVariableMapping'] != '{}' &&
          !isEqual(
            questionElement._graphQLVariables,
            graphQLVariables(questionElement, 'gqlVariableMapping')
          )
        ) {
          questionElement.setPropertyValue(
            '_graphQLVariables',
            graphQLVariables(questionElement, 'gqlVariableMapping')
          );
          updateChoices();
        }
      });
    }

    (questionElement.survey as SurveyModel).onValueChanged.add(() => {
      if (get(questionElement, 'gqlUrl') && get(questionElement, 'gqlQuery')) {
        const choices = questionElement.getPropertyValue('visibleChoices');
        // Avoid to update if choices not defined yet, otherwise, it removes the value
        if (choices.length > 0) {
          setQuestionValue(
            questionElement,
            questionElement.getPropertyValue('visibleChoices')
          );
        }
      }
    });
  }
};
