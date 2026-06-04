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
  if (questionElement.refresh$) {
    // Cancel any previous in-flight request before re-registering on re-render
    questionElement.refresh$.next();
  } else {
    questionElement.refresh$ = new Subject();
  }
  if (isSelectQuestion(questionElement)) {
    // In SurveyCreator design mode the choices are not displayed in the
    // design surface; running the fetch + visibleChoices cascade there only
    // adds work (heavier path because of `isAddDefaultItems`, plus property
    // grid listeners) and was the source of UI freezes in the form builder.
    const isDesignMode = (questionElement.survey as SurveyModel)?.isDesignMode;
    if (isDesignMode) {
      return;
    }
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
          const choices = jsonpath
            .query(result, get(questionElement, 'gqlPath'))
            .map((x) => ({
              value: get(x, valueName),
              text: get(x, titleName),
            }));
          const choiceItems = choices.map((choice) => new ItemValue(choice));
          choiceItems.forEach((item) => {
            (item as any).locOwner = questionElement;
          });
          // Inject items via the internal `choicesFromUrl` slot — the same
          // one used by SurveyJS's built-in `choicesByUrl`. It is not a
          // serialized property, but it feeds `visibleChoices` and
          // `displayValue` through the normal select-base pipeline, so
          // expressions like `displayValue('q')` resolve to the choice text
          // rather than the raw value. This also survives the internal
          // visibleChoices recompute triggered by setQuestionValue below,
          // which previously wiped a direct `visibleChoices` override.
          (questionElement as any).choicesFromUrl = choiceItems;
          // Setting `choices` to [] keeps the items out of the editor's
          // "Choices" tab / serialized JSON, AND triggers SurveyJS's built-in
          // `choices` propertyChanged handler which runs `filterItems()` +
          // `onVisibleChoicesChanged()` for us — a single cascade. We only
          // force the cascade ourselves when `choices` is already empty (the
          // assignment then no-ops and would otherwise leave visibleChoices
          // stale on a refetch).
          const wasChoicesEmpty =
            !questionElement.choices || questionElement.choices.length === 0;
          questionElement.choices = [];
          if (wasChoicesEmpty) {
            (questionElement as any).onVisibleChoicesChanged();
          }
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
      // Remove stale handler from a previous render of this question to prevent accumulation
      if ((questionElement as any)._gqlLinkedChoicesHandler) {
        (questionElement.survey as SurveyModel).onValueChanged.remove(
          (questionElement as any)._gqlLinkedChoicesHandler
        );
      }
      const linkedChoicesHandler = async () => {
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
      };
      (questionElement as any)._gqlLinkedChoicesHandler = linkedChoicesHandler;
      (questionElement.survey as SurveyModel).onValueChanged.add(
        linkedChoicesHandler
      );
    }

    // Remove stale handler from a previous render of this question to prevent accumulation
    if ((questionElement as any)._gqlValueUpdateHandler) {
      (questionElement.survey as SurveyModel).onValueChanged.remove(
        (questionElement as any)._gqlValueUpdateHandler
      );
    }
    const valueUpdateHandler = () => {
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
    };
    (questionElement as any)._gqlValueUpdateHandler = valueUpdateHandler;
    (questionElement.survey as SurveyModel).onValueChanged.add(
      valueUpdateHandler
    );
  }
};
