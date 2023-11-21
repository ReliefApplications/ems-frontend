import { ApolloClient, DocumentNode, InMemoryCache, gql } from '@apollo/client';
import { Serializer, SurveyModel } from 'survey-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { get } from 'lodash';

/** Cache for queries */
const cache = new InMemoryCache();

type SurveyQueryDefinition = {
  // API URL
  url: string;
  // Stringified query
  query: string;
  // Query variables, keys are variable names, values are question names from the survey
  variables: Record<string, string>;
};

/** Adds integration with GraphQL queries for the choices on select questions */
export const init = (): void => {
  Serializer.addProperty('selectBase', {
    name: 'graphqlQuery:text',
    displayName: 'Query',
    category: 'Choices by GraphQL',
  });

  Serializer.addProperty('selectBase', {
    name: 'path:text',
    displayName: 'Data path',
    category: 'Choices by GraphQL',
  });

  Serializer.addProperty('selectBase', {
    name: 'dataKey:text',
    displayName: 'Data key',
    category: 'Choices by GraphQL',
  });

  Serializer.addProperty('selectBase', {
    name: 'displayKey:text',
    displayName: 'Display key',
    category: 'Choices by GraphQL',
  });
};

/** Manages the graphQL queries of a survey */
export class SurveyGraphQLQueryManager {
  /** Map of queries and their current results */
  private queriesByName: Record<
    string,
    {
      query: DocumentNode;
      url: string;
      variables: Record<
        string,
        {
          question: string;
          required: boolean;
        }
      >;
      result: BehaviorSubject<any>;
    }
  > = {};

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

    // @TODO: Execute the queries for the first time
  }

  /** Initializes the queries */
  private initQueries() {
    const definitions: SurveyQueryDefinition[] =
      this.survey.graphQLQueries ?? [];

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
        return (
          definitionVariables.includes(variableName) &&
          this.survey.getQuestionByName(definition.variables[variableName])
        );
      });

      if (!canBuildQuery || !queryDefinition.name) {
        console.error('Unable to build query because of missing variables');
        return;
      }

      // Init the query variables
      this.queriesByName[queryDefinition.name.value] = {
        query,
        url: definition.url,
        variables: variableDefinitions.reduce(
          (acc, variable) => {
            const variableName = variable.variable.name.value;
            acc[variableName] = {
              question: definition.variables[variableName],
              required: variable.type.kind === 'NonNullType',
            };
            return acc;
          },
          {} as Record<
            string,
            {
              question: string;
              required: boolean;
            }
          >
        ),
        result: new BehaviorSubject(null),
      };
    });

    console.log(this.queriesByName);

    // Add listener to update the query results when a question value changes
    this.survey.onValueChanged.add((sender, options) => {
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

        const allRequiredVariablesSet = requiredVariables.every(
          (variable) =>
            this.survey.getQuestionByName(query.variables[variable].question)
              ?.value
        );

        // If not all required variables are set, do not run the query
        if (!allRequiredVariablesSet) {
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
        console.log(result);
        query.result.next(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** Sets up the listeners to update the choices of the questions */
  private setupListeners() {
    const questions = this.survey.getAllQuestions();

    questions.forEach((question) => {
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

      query.result.subscribe((result) => {
        if (!result) {
          return;
        }

        const data = get(result, path);

        if (!data) {
          return;
        }

        const choices = data.map((item: any) => ({
          value: item[dataKey],
          text: item[displayKey],
        }));

        question.choices = choices;
      });
    });
  }
}
