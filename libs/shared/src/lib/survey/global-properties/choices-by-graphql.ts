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
import {
  Observable,
  Subject,
  catchError,
  defer,
  map,
  of,
  switchMap,
} from 'rxjs';
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

  if (isSelectQuestion(questionElement)) {
    // In SurveyCreator design mode the choices are not displayed in the
    // design surface; running the fetch + visibleChoices cascade there only
    // adds work (heavier path because of `isAddDefaultItems`, plus property
    // grid listeners) and was the source of UI freezes in the form builder.
    const isDesignMode = (questionElement.survey as SurveyModel)?.isDesignMode;
    if (isDesignMode) {
      return;
    }

    // Put the rendered control into its loading state
    const setLoading = () => {
      if (questionElement._instance) {
        questionElement._instance.loading = true;
        questionElement._instance.disabled = true;
        questionElement._instance.toggle(false);
      }
    };
    // Restore the control once a request settles (success or error)
    const resetLoadingState = () => {
      if (questionElement._instance) {
        const isDisplay =
          (questionElement.survey as SurveyModel).mode === 'display';
        questionElement._instance.loading = false;
        questionElement._instance.readonly =
          isDisplay || questionElement.readOnly;
        questionElement._instance.disabled =
          isDisplay || questionElement.readOnly;
      }
    };

    // Build the request for the question's current configuration
    const buildRequest$ = (): Observable<any> => {
      const url = get(questionElement, 'gqlUrl');
      const query = get(questionElement, 'gqlQuery');
      const variables = graphQLVariables(questionElement, 'gqlVariableMapping');
      // Transform variables to make sure JSON can be passed
      transformGraphQLVariables(get(questionElement, 'gqlQuery'), variables);

      if (url.startsWith(csApiUrl)) {
        // Common Services API call
        return apollo.use('csClient').query({
          query: gql`
            ${query}
          `,
          variables,
        });
      }
      // other API call
      return http.post(url, { query, variables });
    };

    // Apply a fetched result to the question's choices
    const applyResult = (result: any) => {
      questionElement.setPropertyValue(
        '_graphQLVariables',
        graphQLVariables(questionElement, 'gqlVariableMapping')
      );
      const valueName = get(questionElement, 'gqlValueName');
      const titleName = get(questionElement, 'gqlTitleName');
      // Build the items in a single pass (value/text/locOwner together).
      const choiceItems: ItemValue[] = jsonpath
        .query(result, get(questionElement, 'gqlPath'))
        .map((x) => {
          const item = new ItemValue({
            value: get(x, valueName),
            text: get(x, titleName),
          });
          (item as any).locOwner = questionElement;
          return item;
        });

      // Fast path for huge choice lists (~40k items). The widget renders from
      // `visibleChoices`, so we set it directly and skip the normal update path,
      // which freezes on big lists: O(n) `getFilteredChoices()` + a deep-compare
      // of the new array against the old one.
      //
      // `isLockVisibleChoices` blocks the recomputes that setting `choicesFromUrl`
      // / `choices` / the value would otherwise trigger (they'd overwrite our
      // direct value); it stays on through `setQuestionValue`. Setting [] first
      // makes each compare O(1) (length mismatch) instead of deep-comparing 40k.
      //
      // Trade-off: this skips the filtered-choices cache that survey-core's
      // `displayValue()` / `getItemByValue()` read, so value→text resolution at
      // the survey level isn't refreshed. The widget's own rendering is fine.
      (questionElement as any).isLockVisibleChoices = true;
      (questionElement as any).choicesFromUrl = choiceItems;
      questionElement.choices = [];
      questionElement.setPropertyValue('visibleChoices', []);
      questionElement.setPropertyValue('visibleChoices', choiceItems);

      // Should remove items that are not part anymore of the list of available choices
      setQuestionValue(questionElement, choiceItems);
      (questionElement as any).isLockVisibleChoices = false;
    };

    const updateChoices = () => questionElement.refresh$.next();

    // Everything below is wired exactly ONCE per question. `onAfterRenderQuestion`
    // fires on every (re)render, so re-running it would rebuild the entire choice
    // list and stack duplicate `onValueChanged` listeners — with a large result
    // set (tens of thousands of items) that repeated work is what froze the UI.
    // `switchMap` still cancels any request in flight from a previous emission
    // before starting a new one, so triggering a (re)fetch is just
    // `refresh$.next()`.
    if (!questionElement.refresh$) {
      questionElement.refresh$ = new Subject<void>();
      const survey = questionElement.survey as SurveyModel;
      const subscription = questionElement.refresh$
        .pipe(
          switchMap(() => {
            setLoading();
            // `defer` so a synchronous throw while building the request
            // (e.g. a missing url) surfaces as an inner error we can catch,
            // instead of terminating the long-lived outer subscription.
            return defer(() => buildRequest$()).pipe(
              map((result) => ({ result })),
              catchError(() => of(null))
            );
          })
        )
        .subscribe((payload: { result: any } | null) => {
          if (payload) {
            applyResult(payload.result);
          }
          resetLoadingState();
        });

      // Survey-level listeners we add, tracked so `dispose()` can detach them.
      const detachers: Array<() => void> = [];

      // Refetch this question's choices when a question it depends on changes.
      const containsLinkedReferenceDataQuestions = survey
        .getAllQuestions()
        .find((qu) => qu['gqlVariableMapping']);
      if (containsLinkedReferenceDataQuestions) {
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
        survey.onValueChanged.add(linkedChoicesHandler);
        detachers.push(() =>
          survey.onValueChanged.remove(linkedChoicesHandler)
        );
      }

      // Keep the selected value(s) reconciled with the available choices.
      const valueUpdateHandler = () => {
        if (
          get(questionElement, 'gqlUrl') &&
          get(questionElement, 'gqlQuery')
        ) {
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
      survey.onValueChanged.add(valueUpdateHandler);
      detachers.push(() => survey.onValueChanged.remove(valueUpdateHandler));

      // SurveyJS exposes no per-question "destroyed" event, only `dispose()`,
      // which it calls both when a single question is removed and when the
      // whole survey is torn down. Wrap it once to cancel any in-flight request
      // (via `switchMap`), end the subject, and detach the survey listeners so
      // none of this outlives the question.
      const disposeQuestion = questionElement.dispose.bind(questionElement);
      questionElement.dispose = () => {
        subscription.unsubscribe();
        questionElement.refresh$.complete();
        detachers.forEach((detach) => detach());
        disposeQuestion();
      };

      // Initial load — once. Subsequent fetches come from the listeners above.
      if (get(questionElement, 'gqlUrl') && get(questionElement, 'gqlQuery')) {
        updateChoices();
      }
    }
  }
};
