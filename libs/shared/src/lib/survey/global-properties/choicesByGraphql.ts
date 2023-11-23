import { ApolloClient, DocumentNode, InMemoryCache, gql } from '@apollo/client';
import { Question, Serializer, SurveyModel } from 'survey-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { get } from 'lodash';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { SurveyQuery } from '../components/survey-queries/survey-queries.model';

/** Cache for queries */
const cache = new InMemoryCache();

/** Adds integration with GraphQL queries for the choices on select questions */
export const init = (): void => {
  // Register survey queries component to the survey settings
  Serializer.addProperty('survey', {
    name: 'graphQLQueries',
    type: CustomPropertyGridComponentTypes.surveyQueries,
    displayName: ' ',
    category: 'GraphQL Queries',
  });

  registerCustomPropertyEditor(CustomPropertyGridComponentTypes.surveyQueries);

  // Selection of a query on the dropdown question
  Serializer.addProperty('selectBase', {
    name: 'graphqlQuery:dropdown',
    displayName: 'Select a query',
    category: 'Choices by GraphQL',
    choices: (question: Question, choicesCallback: (_: any[]) => void) => {
      const survey = question.survey as SurveyModel;
      if (!survey.graphQLQueries) {
        choicesCallback([]);
        return;
      }

      choicesCallback(survey.graphQLQueries.map((q: SurveyQuery) => q.name));
    },
  });

  Serializer.addProperty('selectBase', {
    name: 'path:string',
    displayName: 'Data path',
    category: 'Choices by GraphQL',
  });

  Serializer.addProperty('selectBase', {
    name: 'dataKey:string',
    displayName: 'Data key',
    category: 'Choices by GraphQL',
  });

  Serializer.addProperty('selectBase', {
    name: 'displayKey:string',
    displayName: 'Display key',
    category: 'Choices by GraphQL',
  });
};

type QuestionWithGraphQLQuery = {
  query: DocumentNode;
  url: string;
  variables: Record<
    // Query variable name
    string,
    {
      // Question name
      question: string;
      required: boolean;
    }
  >;
  result: BehaviorSubject<any>;
};

/** Manages the graphQL queries of a survey */
export class SurveyGraphQLQueryManager {
  /** Map of queries and their current results */
  private queriesByName: Record<string, QuestionWithGraphQLQuery> = {};

  /**
   * Gets object with the current results of the queries as observables
   *
   * @returns Object with the current results of the queries as observables
   */
  get queryResults$(): Record<string, Observable<any>> {
    const queries = Object.keys(this.queriesByName);
    return queries.reduce((acc, query) => {
      acc[query] = this.queriesByName[query].result.asObservable();
      return acc;
    }, {} as Record<string, Observable<any>>);
  }

  /**
   * Manages the graphQL queries of a survey
   *
   * @param survey Survey to manage
   */
  constructor(private survey: SurveyModel) {
    // Reference to this object on the survey
    survey.graphQLQueryManager = this;

    // Initialize the queries
    this.initQueries();

    // Setup the question choices listeners
    this.setupListeners();

    // Run the available queries if all required variables are set when the survey is ready
    this.survey.onAfterRenderSurvey.add(() => {
      this.runQueries();
    });
  }

  /** Initializes the queries */
  private initQueries() {
    const definitions: SurveyQuery[] = this.survey.graphQLQueries ?? [];

    definitions.forEach((definition) => {
      // Create the query
      const query = gql(definition.query);

      const definitionVariables = Object.keys(definition.variables);
      const queryDefinition = query.definitions[0];

      if (queryDefinition.kind !== 'OperationDefinition') {
        return;
      }

      const variableDefinitions = queryDefinition.variableDefinitions || [];

      // Check that for each variable of the query, a variable with the same name exists
      // on the query definition and that the question with the same name exists on the survey
      const canBuildQuery = variableDefinitions.every((variableDefinition) => {
        const variableName = variableDefinition.variable.name.value;
        const hasQuestion = !!this.survey.getQuestionByName(
          definition.variables[variableName].question
        );
        const isRequired = definition.variables[variableName].required;
        return (
          definitionVariables.includes(variableName) &&
          (hasQuestion || isRequired)
        );
      });

      if (!canBuildQuery || !queryDefinition.name) {
        console.error(
          `Unable to build query ${queryDefinition.name?.value} because of missing variables `
        );
        return;
      }

      // Init the query variables
      this.queriesByName[queryDefinition.name.value] = {
        query,
        url: definition.url,
        variables: variableDefinitions.reduce((acc, variable) => {
          const variableName = variable.variable.name.value;
          acc[variableName] = {
            question: definition.variables[variableName].question,
            required: variable.type.kind === 'NonNullType',
          };
          return acc;
        }, {} as QuestionWithGraphQLQuery['variables']),
        result: new BehaviorSubject(null),
      };
    });
  }

  /** Sets up the listeners to update the choices of the questions */
  private setupListeners() {
    // Add listener to update the query results when a question value changes
    this.survey.onValueChanged.add((_, options) => {
      const questionName = options.name;
      const question = this.survey.getQuestionByName(questionName);

      if (!question) {
        return;
      }

      const queries = Object.keys(this.queriesByName);

      queries.forEach((queryName) => {
        const query = this.queriesByName[queryName];
        const queryVariables = Object.keys(query.variables);
        const questionNames = queryVariables.map(
          (variable) => query.variables[variable].question
        );

        // Check that the question is used in the query
        if (!questionNames.includes(questionName)) {
          return;
        }

        // Check every required variable is set
        const requiredVariables = queryVariables.filter(
          (variable) => query.variables[variable].required
        );

        // Check if all required variables are set
        const allRequiredVariablesSet = requiredVariables.every(
          (variable) =>
            this.survey.getQuestionByName(query.variables[variable].question)
              ?.value
        );

        // If not all required variables are set, do not run the query
        if (!allRequiredVariablesSet) {
          // Reset the query result
          query.result.next(null);
          return;
        }

        // Build the variables object
        const variables = queryVariables.reduce((acc, variable) => {
          acc[variable] = this.survey.getQuestionByName(
            query.variables[variable].question
          )?.value;
          return acc;
        }, {} as Record<string, string>);

        // Execute the query
        this.executeQuery(queryName, variables);
      });
    });

    // Add listener to update the choices when the query result changes
    this.survey.getAllQuestions().forEach((question) => {
      if (!question.isDescendantOf('selectBase')) {
        return;
      }

      const queryName = question.getPropertyValue('graphqlQuery');
      const path = question.getPropertyValue('path');
      const dataKey = question.getPropertyValue('dataKey');
      const displayKey = question.getPropertyValue('displayKey') ?? dataKey;

      if (!queryName || !path || !dataKey) {
        return;
      }

      const query = this.queriesByName[queryName];
      if (!query) {
        return;
      }

      // Subscribe to the query result and update the choices
      query.result.subscribe((result) => {
        if (!result) {
          // Reset the question value
          question.value = null;

          // Reset the question choices
          question.choices = [];
          return;
        }

        // Get the data using the path
        const data = get(result, path || '');

        if (!data || !Array.isArray(data)) {
          return;
        }

        // Update the question choices
        question.choices = data.map((item: any) => ({
          value: item[dataKey],
          text: item[displayKey],
        }));
      });
    });
  }

  /** Runs the available queries if all required variables are set */
  private runQueries() {
    const queries = Object.keys(this.queriesByName);

    queries.forEach((queryName) => {
      const query = this.queriesByName[queryName];
      const queryVariables = Object.keys(query.variables);

      // Check every required variable is set
      const requiredVariables = queryVariables.filter(
        (variable) => query.variables[variable].required
      );

      const allRequiredVariablesSet = requiredVariables.every(
        (variable) =>
          !!this.survey.getQuestionByName(query.variables[variable].question)
            ?.value
      );

      // If not all required variables are set, do not run the query
      if (!allRequiredVariablesSet) {
        // Reset the query result
        query.result.next(null);

        return;
      }

      // Build the variables object
      const variables = queryVariables.reduce((acc, variable) => {
        acc[variable] = this.survey.getQuestionByName(
          query.variables[variable].question
        )?.value;
        return acc;
      }, {} as Record<string, any>);

      // Execute the query
      this.executeQuery(queryName, variables);
    });
  }

  /**
   * Executes a query
   *
   * @param queryName Name of the query to execute
   * @param variables Variables to use on the query
   */
  private executeQuery(queryName: string, variables: Record<string, any>) {
    const query = this.queriesByName[queryName];
    const client = new ApolloClient({
      uri: query.url,
      cache,
    });

    client
      .query({
        query: query.query,
        variables,
      })
      .then((result) => {
        query.result.next(result);
      })
      .catch((error) => {
        console.error('Error executing query', error);
      });
  }
}
