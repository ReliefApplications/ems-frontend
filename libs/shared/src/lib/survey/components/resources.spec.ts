import { Dialog } from '@angular/cdk/dialog';
import { Injector, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { DomService } from '../../services/dom/dom.service';
import { init } from './resources';
import { processNewCreatedRecords } from './utils';

/** Flushes pending microtasks and the next queued timer. */
const flushAsyncTasks = async () => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

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

jest.mock('../../components/ui/core-grid/core-grid.component', () => ({
  CoreGridComponent: jest.fn(),
}));

jest.mock('survey-core', () => {
  const actual = jest.requireActual('survey-core');

  return {
    ...actual,
    ConditionRunner: jest.fn().mockImplementation(() => ({
      run: jest.fn(() => true),
    })),
  };
});

describe('resources question', () => {
  const mockedProcessNewCreatedRecords =
    processNewCreatedRecords as jest.MockedFunction<
      typeof processNewCreatedRecords
    >;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    mockedProcessNewCreatedRecords.mockResolvedValue({
      query: {
        temporaryRecords: [],
      },
    } as any);
  });

  it('should force an empty filter when clearIf matches on a display-only grid', async () => {
    const componentCollection = {
      add: jest.fn(),
    };

    const gridInstance = {
      configureGrid: jest.fn(),
      removeRowIds: new Subject<string[]>(),
      selectionChange: new Subject<unknown>(),
      settings: {} as {
        query?: {
          filter?: unknown;
        };
      },
    };

    const domService = {
      appendComponentToBody: jest.fn(() => ({
        instance: gridInstance,
      })),
      removeComponentFromBody: jest.fn(),
    };

    const injector = {
      get: jest.fn((token: unknown) => {
        if (token === DomService) {
          return domService;
        }

        if (token === Apollo || token === Dialog) {
          return {};
        }

        return null;
      }),
    } as unknown as Injector;

    init(injector, componentCollection as any, {} as NgZone, document);

    const component = componentCollection.add.mock.calls[0][0];
    const content = document.createElement('div');
    content.className = 'sd-question__content';
    content.appendChild(document.createElement('div'));

    const element = document.createElement('div');
    element.appendChild(content);
    document.body.appendChild(element);

    const question = {
      canSearch: false,
      customFilter: '',
      displayAsGrid: true,
      displayOnly: true,
      getPropertyValue: jest.fn((property: string) =>
        property === 'clearIf' ? '{dependentQuestion} empty' : ''
      ),
      gridFieldsSettings: undefined,
      onSelect: '',
      readOnly: false,
      registerFunctionOnPropertiesValueChanged: jest.fn(),
      registerFunctionOnPropertyValueChanged: jest.fn(),
      resource: 'resource-id',
      survey: {
        mode: 'display',
        getFilteredProperties: jest.fn(() => []),
        getFilteredValues: jest.fn(() => ({ dependentQuestion: null })),
        onValueChanged: {
          add: jest.fn(),
        },
      },
      value: [],
    };

    component.onAfterRender(question as any, element);
    await flushAsyncTasks();
    await flushAsyncTasks();

    const settings = gridInstance.settings as unknown as {
      query: {
        filter: unknown;
      };
    };

    expect(domService.appendComponentToBody).toHaveBeenCalled();
    expect(settings.query.filter).toEqual({
      logic: 'and',
      filters: [
        {
          field: 'ids',
          operator: 'eq',
          value: [],
        },
      ],
    });
    expect(gridInstance.configureGrid).toHaveBeenCalledTimes(1);
  });

  it('should copy incrementalId and map Common Services display text on selection change', async () => {
    const componentCollection = {
      add: jest.fn(),
    };

    const gridInstance = {
      configureGrid: jest.fn(),
      removeRowIds: new Subject<string[]>(),
      selectionChange: new Subject<unknown>(),
      settings: {} as any,
    };

    const domService = {
      appendComponentToBody: jest.fn(() => ({
        instance: gridInstance,
      })),
      removeComponentFromBody: jest.fn(),
    };

    const apolloMock = {
      query: jest.fn().mockReturnValue({
        subscribe: (cb: any) => {
          cb({
            data: {
              record: {
                id: 'record-1',
                incrementalId: 'INC-999',
                data: {
                  country: 'country-id-123',
                },
              },
            },
          });
          return { unsubscribe: jest.fn() };
        },
      }),
    };

    const injector = {
      get: jest.fn((token: unknown) => {
        if (token === DomService) {
          return domService;
        }
        if (token === Apollo) {
          return apolloMock;
        }
        if (token === Dialog) {
          return {};
        }
        return null;
      }),
    } as unknown as Injector;

    init(injector, componentCollection as any, {} as NgZone, document);

    const component = componentCollection.add.mock.calls[0][0];
    const content = document.createElement('div');
    content.className = 'sd-question__content';
    content.appendChild(document.createElement('div'));

    const element = document.createElement('div');
    element.appendChild(content);
    document.body.appendChild(element);

    const targetQuestionObj: any = {
      choices: [],
    };

    const survey = {
      mode: 'display',
      setValue: jest.fn(),
      getQuestionByName: jest.fn((name: string) => {
        if (name === 'targetCommonService') {
          return targetQuestionObj;
        }
        return null;
      }),
      getFilteredProperties: jest.fn(() => []),
      getFilteredValues: jest.fn(() => ({})),
      onValueChanged: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    };

    const question = {
      canSearch: false,
      customFilter: '',
      displayAsGrid: true,
      displayOnly: true,
      getPropertyValue: jest.fn(() => ''),
      gridFieldsSettings: undefined,
      onSelect: JSON.stringify({
        targetField: '{incrementalId}',
        targetCommonService: '{country}',
      }),
      readOnly: false,
      registerFunctionOnPropertiesValueChanged: jest.fn(),
      registerFunctionOnPropertyValueChanged: jest.fn(),
      resource: 'resource-id',
      survey,
      value: [],
    };

    component.onAfterRender(question as any, element);
    await flushAsyncTasks();

    gridInstance.selectionChange.next({
      selectedRows: [
        {
          dataItem: {
            id: 'record-1',
            country: 'country-id-123',
            text: {
              country: 'Burkina Faso',
            },
          },
        },
      ],
    });

    expect(apolloMock.query).toHaveBeenCalled();
    expect(survey.setValue).toHaveBeenCalledWith('targetField', 'INC-999');
    expect(survey.setValue).toHaveBeenCalledWith(
      'targetCommonService',
      'country-id-123'
    );
    expect(targetQuestionObj.choices).toEqual([
      { value: 'country-id-123', text: 'Burkina Faso' },
    ]);
  });
});
