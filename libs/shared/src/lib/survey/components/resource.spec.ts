import { Dialog } from '@angular/cdk/dialog';
import { Injector, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { init } from './resource';

describe('resource question', () => {
  it('should expose selected record variables to survey expressions', () => {
    const apollo = {
      query: jest.fn(() =>
        of({
          data: {
            resource: {
              name: 'Countries',
              records: {
                edges: [
                  {
                    node: {
                      id: 'record-id',
                      incrementalId: '42',
                      data: {
                        code: 'FR',
                        name: 'France',
                      },
                    },
                  },
                ],
              },
            },
          },
        })
      ),
    };
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
    const componentCollection = {
      add: jest.fn(),
    };

    init(injector, componentCollection as any, {} as NgZone, document);

    const component = componentCollection.add.mock.calls[0][0];
    const survey = {
      setVariable: jest.fn(),
    };
    const question = {
      contentQuestion: {},
      displayField: 'name',
      name: 'countryQuestion',
      resource: 'resource-id',
      survey,
      value: 'record-id',
    };

    component.populateChoices(question as any);

    expect(survey.setVariable).toHaveBeenCalledWith(
      'countryQuestion.id',
      'record-id'
    );
    expect(survey.setVariable).toHaveBeenCalledWith(
      'countryQuestion.incrementalId',
      '42'
    );
    expect(survey.setVariable).toHaveBeenCalledWith(
      'countryQuestion.displayValue',
      'France'
    );
    expect(survey.setVariable).toHaveBeenCalledWith(
      'countryQuestion.code',
      'FR'
    );
  });
});
