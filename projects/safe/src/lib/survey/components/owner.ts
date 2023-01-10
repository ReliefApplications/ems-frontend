import { Apollo } from 'apollo-angular';
import {
  GetRolesFromApplicationsQueryResponse,
  GET_ROLES_FROM_APPLICATIONS,
} from '../graphql/queries';
import { QuestionOwner } from '../types';

/**
 * Inits the owner component.
 *
 * @param Survey Survey library.
 * @param apollo Apollo client.
 */
export const init = (Survey: any, apollo: Apollo): void => {
  const component = {
    name: 'owner',
    title: 'Owner',
    category: 'Custom Questions',
    questionJSON: {
      name: 'owner',
      type: 'tagbox',
      optionsCaption: 'Select roles...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    onInit: (): void => {
      Survey.Serializer.addProperty('owner', {
        name: 'applications',
        category: 'Owner properties',
        type: 'application-dropdown',
        isDynamicChoices: true,
        visibleIndex: 3,
        required: true,
      });
    },
    onLoaded: (question: QuestionOwner): void => {
      apollo
        .query<GetRolesFromApplicationsQueryResponse>({
          query: GET_ROLES_FROM_APPLICATIONS,
          variables: {
            applications: question.applications,
          },
        })
        .subscribe((res) => {
          if (res.data.rolesFromApplications) {
            const roles = [];
            for (const role of res.data.rolesFromApplications) {
              roles.push({ value: role.id, text: role.title });
            }
            question.contentQuestion.choices = roles;
          }
        });
    },
    onAfterRender: (): void => {},
  };
  Survey.ComponentCollection.Instance.add(component);
};
