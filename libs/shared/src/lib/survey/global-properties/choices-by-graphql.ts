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
import { firstValueFrom } from 'rxjs';
import jsonpath from 'jsonpath';
import graphQLVariables from './graphql-variables';
import { isEqual } from 'lodash';
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
    name: `${prefix}url:string`,
    displayName: 'Service URL',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}query`,
    displayName: 'GraphQL Query',
    category,
    type: CustomPropertyGridComponentTypes.queryEditor,
    visibleIndex: (visibleIndex += 1),
  });

  registerCustomPropertyEditor(CustomPropertyGridComponentTypes.queryEditor);

  serializer.addProperty(questionType, {
    name: `${prefix}path:string`,
    displayName: 'Path to data within the service',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}valueName:string`,
    displayName: 'Get values from the following JSON field',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}titleName:string`,
    displayName: 'Get display texts from the following JSON field',
    category,
    visibleIndex: (visibleIndex += 1),
  });

  serializer.addProperty(questionType, {
    name: `${prefix}variableMapping`,
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
  if (isSelectQuestion(questionElement)) {
    const updateChoices = async () => {
      const valueName = get(questionElement, `${prefix}valueName`);
      const titleName = get(questionElement, `${prefix}titleName`);
      const variables = graphQLVariables(
        questionElement,
        `${prefix}variableMapping`
      );
      // Transform variables to make sure JSON can be passed
      transformGraphQLVariables(
        get(questionElement, `${prefix}query`),
        variables
      );
      console.log(variables);
      firstValueFrom(
        http.post(get(questionElement, `${prefix}url`), {
          query: get(questionElement, `${prefix}query`),
          variables,
        })
      ).then((result) => {
        questionElement.setPropertyValue(
          '_graphQLVariables',
          graphQLVariables(questionElement, `${prefix}variableMapping`)
        );
        // this is to avoid that the choices appear on the 'choices' tab
        // and also to avoid the choices being sent to the server
        questionElement.choices = [];
        const choices = jsonpath
          .query(result, get(questionElement, `${prefix}path`))
          .map((x) => ({
            value: get(x, valueName),
            text: get(x, titleName),
          }));
        const choiceItems = choices.map((choice) => new ItemValue(choice));
        questionElement.setPropertyValue('visibleChoices', choiceItems);
      });
    };

    if (
      get(questionElement, `${prefix}url`) &&
      get(questionElement, `${prefix}query`)
    ) {
      updateChoices();
    }

    // Init linked reference data questions update inside the survey if those question types exists
    const containsLinkedReferenceDataQuestions = (
      questionElement.survey as SurveyModel
    )
      .getAllQuestions()
      .find((qu) => qu[`${prefix}variableMapping`]);
    if (containsLinkedReferenceDataQuestions) {
      (questionElement.survey as SurveyModel).onValueChanged.add(async () => {
        // For the reference data questions in the survey we distinguish two levels of update that could be related but not necessarily related
        //
        // 1. The available choices(visibleChoices property). This has to be updated if the reference data question that it's dependant on has a new value set
        // 2. The selected choices in the question. If the question's selected choices should be updated/cleared if the dependant reference data question changes it's value.
        //
        // As this two update methods could work on their own specific terms, we have one property for each action to handle:
        // - [`${prefix}variableMapping`]

        if (
          questionElement[`${prefix}variableMapping`] &&
          questionElement[`${prefix}variableMapping`] != '{}' &&
          !isEqual(
            questionElement._graphQLVariables,
            graphQLVariables(questionElement, `${prefix}variableMapping`)
          )
        ) {
          questionElement.setPropertyValue(
            '_graphQLVariables',
            graphQLVariables(questionElement, `${prefix}variableMapping`)
          );
          questionElement._instance.loading = true;
          questionElement._instance.disabled = true;
          await updateChoices();
          questionElement._instance.loading = false;
          questionElement._instance.disabled = questionElement.readOnly;
          // updateSelectedChoices();
        }
      });
    }
  }
};
