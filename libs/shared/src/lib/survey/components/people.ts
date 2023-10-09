import { ComponentCollection, Serializer, SvgRegistry } from 'survey-core';
import { registerCustomPropertyEditor } from './utils/component-register';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';
import { PeopleQueryResponse, Person } from '../../models/people.model';
import { RestService } from '../../services/rest/rest.service';

/**
 * Inits the people component.
 *
 * @param componentCollectionInstance ComponentCollection
 * @param restService RestService
 */
export const init = (
  componentCollectionInstance: ComponentCollection,
  restService: RestService
): void => {
  // registers icon-people in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
    'people',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z"/></svg>'
  );
  const component = {
    name: 'people',
    title: 'People',
    iconName: 'icon-people',
    category: 'Custom Questions',
    questionJSON: {
      name: 'people',
      type: 'tagbox',
      optionsCaption: 'Select people...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    onInit: (): void => {
      Serializer.addProperty('people', {
        name: 'applications',
        category: 'people properties',
        type: 'applicationsDropdown',
        isDynamicChoices: true,
        visibleIndex: 3,
        required: true,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.applicationsDropdown
      );
    },
    onLoaded: (question: any): void => {
      restService
        .post('proxy/common-services/graphql', {
          query: `query {
              users {
                  firstname
                  lastname
                  emailaddress
              }
            }`,
        })
        .subscribe((response: PeopleQueryResponse) => {
          if (response.data) {
            //Format data like this "name, surname (email)"
            const people = response.data.users.map((person: Person) => {
              const fullname =
                person.firstname && person.lastname
                  ? `${person.firstname}, ${person.lastname}`
                  : person.firstname || person.lastname;
              return {
                value: person.emailaddress,
                text: `${fullname} (${person.emailaddress})`,
              };
            });
            question.contentQuestion.choices = people;
          }
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAfterRender: (): void => {},
  };
  componentCollectionInstance.add(component);
};
