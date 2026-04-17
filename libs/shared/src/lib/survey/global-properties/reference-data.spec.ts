import { Injector } from '@angular/core';
import { Serializer } from 'survey-core';
import { ReferenceDataService } from '../../services/reference-data/reference-data.service';
import { render } from './reference-data';

/** Flushes pending promise callbacks. */
const flushAsyncTasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('reference data global properties', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should keep tagbox displayValue in sync as an array of texts', async () => {
    jest.spyOn(Serializer, 'isDescendantOf').mockReturnValue(true);

    const referenceDataService = {
      cacheItems: jest.fn(() => Promise.resolve({})),
      getChoice: jest.fn(),
      getChoices: jest.fn(() =>
        Promise.resolve([
          {
            value: 'fr',
            text: 'France',
          },
          {
            value: 'de',
            text: 'Germany',
          },
        ])
      ),
      loadReferenceData: jest.fn(() =>
        Promise.resolve({
          id: 'reference-data-id',
          valueField: 'id',
        })
      ),
    };
    const survey = {
      data: {},
      getAllQuestions: jest.fn(() => []),
      onValueChanged: {
        add: jest.fn(),
      },
      registerFunctionOnPropertyValueChanged: jest.fn(),
      setVariable: jest.fn(),
    };
    const question = {
      _instance: {
        disabled: false,
        loading: false,
        value: null,
      },
      choices: [],
      getType: jest.fn(() => 'tagbox'),
      isPrimitiveValue: true,
      name: 'countries',
      referenceData: 'reference-data-id',
      referenceDataChoicesLoaded: false,
      referenceDataDisplayField: 'label',
      registerFunctionOnPropertyValueChanged: jest.fn(),
      setPropertyValue: jest.fn(function (this: any, key: string, value: any) {
        this[key] = value;
      }),
      survey,
      value: ['fr', 'es'],
      valueChangedCallback: jest.fn(),
      visibleChoices: [],
    };
    const injector = {
      get: jest.fn((token: unknown) =>
        token === ReferenceDataService ? referenceDataService : null
      ),
    } as unknown as Injector;

    render(question as any, injector);
    await flushAsyncTasks();

    expect(survey.setVariable).toHaveBeenCalledWith('countries.displayValue', [
      'France',
      'es',
    ]);

    question.value = ['de'];
    await question.valueChangedCallback();

    expect(survey.setVariable).toHaveBeenLastCalledWith(
      'countries.displayValue',
      ['Germany']
    );
  });

  it('should resolve non-primitive tagbox values to their display texts', async () => {
    jest.spyOn(Serializer, 'isDescendantOf').mockReturnValue(true);

    const referenceDataService = {
      cacheItems: jest.fn(() => Promise.resolve({})),
      getChoice: jest.fn(),
      getChoices: jest.fn(() =>
        Promise.resolve([
          {
            value: {
              id: 'fr',
              label: 'France',
            },
            text: 'France',
          },
          {
            value: {
              id: 'de',
              label: 'Germany',
            },
            text: 'Germany',
          },
        ])
      ),
      loadReferenceData: jest.fn(() =>
        Promise.resolve({
          id: 'reference-data-id',
          valueField: 'id',
        })
      ),
    };
    const survey = {
      data: {},
      getAllQuestions: jest.fn(() => []),
      onValueChanged: {
        add: jest.fn(),
      },
      registerFunctionOnPropertyValueChanged: jest.fn(),
      setVariable: jest.fn(),
    };
    const question = {
      _instance: {
        disabled: false,
        loading: false,
        value: null,
      },
      _referenceData: {
        valueField: 'id',
      },
      choices: [],
      getType: jest.fn(() => 'tagbox'),
      isPrimitiveValue: false,
      name: 'countries',
      referenceData: 'reference-data-id',
      referenceDataChoicesLoaded: false,
      referenceDataDisplayField: 'label',
      registerFunctionOnPropertyValueChanged: jest.fn(),
      setPropertyValue: jest.fn(function (this: any, key: string, value: any) {
        this[key] = value;
      }),
      survey,
      value: [
        {
          text: 'France',
          value: {
            id: 'fr',
          },
        },
        {
          text: 'Germany',
          value: {
            id: 'de',
          },
        },
      ],
      valueChangedCallback: jest.fn(),
      visibleChoices: [],
    };
    const injector = {
      get: jest.fn((token: unknown) =>
        token === ReferenceDataService ? referenceDataService : null
      ),
    } as unknown as Injector;

    render(question as any, injector);
    await flushAsyncTasks();

    expect(survey.setVariable).toHaveBeenCalledWith('countries.displayValue', [
      'France',
      'Germany',
    ]);
  });
});
