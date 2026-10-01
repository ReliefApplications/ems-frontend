import { Dialog } from '@angular/cdk/dialog';
import { Injector, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import {
  GET_RESOURCE_QUESTION_RECORD,
  GET_SHORT_RESOURCE_BY_ID,
} from '../graphql/queries';
import { init } from './resource';

jest.mock('./utils', () => ({
  buildAddButton: jest.fn(() => document.createElement('button')),
  buildSearchButton: jest.fn(() => document.createElement('button')),
  canShowSearchButton: jest.fn(() => true),
  processNewCreatedRecords: jest.fn(),
  setUpActionsButtonWrapper: jest.fn(() => document.createElement('div')),
}));

jest.mock('./utils/component-register', () => ({
  registerCustomPropertyEditor: jest.fn(),
}));

/**
 * Builds the resource question component, with a fake Apollo client.
 *
 * @param apollo Fake Apollo client
 * @returns The component registered in the component collection
 */
const createComponent = (apollo: any) => {
  const componentCollection = { add: jest.fn() };
  const injector = {
    get: jest.fn((token: unknown) => {
      if (token === Apollo) {
        return apollo;
      }
      if (token === Dialog) {
        return {};
      }
      return null;
    }),
  } as unknown as Injector;
  init(injector, componentCollection as any, {} as NgZone, document);
  return componentCollection.add.mock.calls[0][0];
};

/**
 * Builds a fake resource question.
 *
 * @param overrides Question properties to override
 * @returns Fake question, with a fake survey
 */
const createFakeQuestion = (overrides: any = {}) => {
  const variables: Record<string, any> = {};
  const callbacks: Record<string, (newValue?: any) => void> = {};
  const survey = {
    data: {},
    getVariableNames: jest.fn(() => Object.keys(variables)),
    getVariable: jest.fn((name: string) => variables[name]),
    setVariable: jest.fn((name: string, value: any) => {
      variables[name] = value;
    }),
    onValueChanged: { add: jest.fn() },
  };
  const contentQuestion: any = {
    optionsCaption: '',
    getPropertyValue: jest.fn(),
    setPropertyValue: jest.fn(),
  };
  const question: any = {
    name: 'country',
    resource: 'resource-id',
    displayField: 'name',
    customFilter: '',
    value: null,
    survey,
    contentQuestion,
    registerFunctionOnPropertyValueChanged: jest.fn(
      (name: string, func: (newValue?: any) => void) => {
        callbacks[name] = func;
      }
    ),
    ...overrides,
  };
  return {
    question,
    survey,
    variables,
    /**
     * Sets the question value, as SurveyJS would: the value callback runs
     * before the content question ( which the question value is read from )
     * is updated, so the question value is still the previous one.
     *
     * @param value New value
     */
    setValue: (value: any) => {
      callbacks['value']?.(value);
      question.value = value;
    },
  };
};

/**
 * Builds a fake Apollo client answering the resource and record queries.
 *
 * @param records Records returned by the record query, by id
 * @returns Fake Apollo client, with a jest mock for query
 */
const createFakeApollo = (records: Record<string, any> = {}) => ({
  query: jest.fn(({ query, variables }: any) => {
    if (query === GET_SHORT_RESOURCE_BY_ID) {
      return of({
        data: {
          resource: {
            id: 'resource-id',
            name: 'Countries',
            queryName: 'allCountries',
            fields: [{ name: 'name', type: 'text' }],
          },
        },
      });
    }
    if (query === GET_RESOURCE_QUESTION_RECORD) {
      const record = records[variables.id];
      return record
        ? of({ data: { record } })
        : throwError(() => new Error('not found'));
    }
    return of({ data: {} });
  }),
});

describe('resource question', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets a choices loader on the content question once the resource is loaded', () => {
    const apollo = createFakeApollo();
    const component = createComponent(apollo);
    const { question } = createFakeQuestion();

    component.onLoaded(question);

    expect(question._resourceInfo).toEqual({
      queryName: 'allCountries',
      field: { name: 'name', type: 'text' },
    });
    expect(question.contentQuestion.choicesLoader).toBeDefined();
    expect(question.contentQuestion.setPropertyValue).toHaveBeenCalledWith(
      'choicesLoaderVersion',
      1
    );
    expect(question.contentQuestion.optionsCaption).toBe(
      'Select a record from Countries...'
    );
  });

  it('exposes the data of the selected record as survey variables', () => {
    const apollo = createFakeApollo({
      'record-id': {
        id: 'record-id',
        data: { name: 'France', status: 'active', population: 2000 },
      },
    });
    const component = createComponent(apollo);
    const { question, survey, setValue } = createFakeQuestion();

    component.onLoaded(question);
    setValue('record-id');

    expect(apollo.query).toHaveBeenCalledWith(
      expect.objectContaining({
        query: GET_RESOURCE_QUESTION_RECORD,
        variables: { id: 'record-id' },
      })
    );
    expect(survey.setVariable).toHaveBeenCalledWith('country.name', 'France');
    expect(survey.setVariable).toHaveBeenCalledWith('country.status', 'active');
    expect(survey.setVariable).toHaveBeenCalledWith('country.population', 2000);
  });

  it('clears the variables of the previous record when the selection is removed', () => {
    const apollo = createFakeApollo({
      'record-id': { id: 'record-id', data: { name: 'France' } },
    });
    const component = createComponent(apollo);
    const { question, variables, setValue } = createFakeQuestion();

    component.onLoaded(question);
    setValue('record-id');
    expect(variables['country.name']).toBe('France');

    setValue(null);
    expect(variables['country.name']).toBeNull();
    // The record query only ran for the selected record
    expect(
      apollo.query.mock.calls.filter(
        ([call]: any) => call.query === GET_RESOURCE_QUESTION_RECORD
      )
    ).toHaveLength(1);
  });

  it('uses the draft data of records created from the question, without querying them', () => {
    const apollo = createFakeApollo();
    const component = createComponent(apollo);
    const { question, variables, setValue } = createFakeQuestion({
      draftData: { 'draft-id': { name: 'New country' } },
    });

    component.onLoaded(question);
    setValue('draft-id');

    expect(variables['country.name']).toBe('New country');
    expect(
      apollo.query.mock.calls.filter(
        ([call]: any) => call.query === GET_RESOURCE_QUESTION_RECORD
      )
    ).toHaveLength(0);
  });

  it('clears the variables when the record cannot be fetched', () => {
    const apollo = createFakeApollo({
      'record-id': { id: 'record-id', data: { name: 'France' } },
    });
    const component = createComponent(apollo);
    const { question, variables, setValue } = createFakeQuestion();

    component.onLoaded(question);
    setValue('record-id');
    expect(variables['country.name']).toBe('France');

    setValue('missing-record');
    expect(variables['country.name']).toBeNull();
  });

  it('rebuilds the loader only when the custom filters change', () => {
    const apollo = createFakeApollo();
    const component = createComponent(apollo);
    const { question, survey } = createFakeQuestion({
      customFilter: JSON.stringify({
        field: 'region',
        operator: 'eq',
        value: '{region}',
      }),
    });
    survey.data = { region: 'EU' };

    component.onLoaded(question);
    expect(question.filters).toEqual({
      field: 'region',
      operator: 'eq',
      value: 'EU',
    });
    const versionCalls = () =>
      question.contentQuestion.setPropertyValue.mock.calls.filter(
        ([name]: any) => name === 'choicesLoaderVersion'
      ).length;
    expect(versionCalls()).toBe(1);

    const onSurveyValueChanged = survey.onValueChanged.add.mock.calls[0][0];
    // Same survey data: nothing to reload
    onSurveyValueChanged();
    expect(versionCalls()).toBe(1);
    // Filter value changed: choices are reloaded
    survey.data = { region: 'AF' };
    onSurveyValueChanged();
    expect(question.filters).toEqual({
      field: 'region',
      operator: 'eq',
      value: 'AF',
    });
    expect(versionCalls()).toBe(2);
  });

  it('automatically selects the only available record when configured', () => {
    const apollo = {
      query: jest.fn(({ query }: any) => {
        if (query === GET_SHORT_RESOURCE_BY_ID) {
          return of({
            data: {
              resource: {
                id: 'resource-id',
                name: 'Countries',
                queryName: 'allCountries',
                fields: [{ name: 'name', type: 'text' }],
              },
            },
          });
        }
        if (query === GET_RESOURCE_QUESTION_RECORD) {
          return of({ data: { record: { id: 'only-one', data: {} } } });
        }
        return of({
          data: {
            allCountries: {
              edges: [{ node: { id: 'only-one', name: 'Only one' } }],
              totalCount: 1,
            },
          },
        });
      }),
    };
    const component = createComponent(apollo);
    const { question } = createFakeQuestion({
      customFilter: JSON.stringify({
        field: 'region',
        operator: 'eq',
        value: 'EU',
      }),
      autoSelectFirstOption: true,
    });

    component.onLoaded(question);

    expect(question.value).toBe('only-one');
  });
});
