import { Apollo } from 'apollo-angular';
import { DomService } from '../../services/dom/dom.service';
import { GetUsersQueryResponse, GET_USERS } from '../graphql/queries';

/**
 * Inits the users component.
 *
 * @param Survey survey library
 * @param domService Dom service.
 * @param apollo Apollo client.
 */
export const init = (
  Survey: any,
  domService: DomService,
  apollo: Apollo
): void => {
  const component = {
    name: 'users',
    title: 'Users',
    category: 'Custom Questions',
    questionJSON: {
      name: 'users',
      type: 'tagbox',
      placeholder: 'Select users...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    onInit: (): void => {
      Survey.Serializer.addProperty('users', {
        name: 'applications',
        category: 'Users properties',
        type: 'application-dropdown',
        isDynamicChoices: true,
        visibleIndex: 3,
        required: true,
      });
    },
    onLoaded: (question: any): void => {
      apollo
        .query<GetUsersQueryResponse>({
          query: GET_USERS,
          variables: {
            applications: question.applications,
          },
        })
        .subscribe((res) => {
          if (res.data.users) {
            const users: any = [];
            for (const user of res.data.users) {
              if (!users.some((el: any) => el.value === user.id)) {
                users.push({ value: user.id, text: user.username });
              }
            }
            question.contentQuestion.choices = users;
          }
        });
    },
    onAfterRender: (): void => {},
  };

  Survey.ComponentCollection.Instance.add(component);
};
