import { Apollo } from 'apollo-angular';
import * as SurveyCreator from 'survey-creator';
import { DomService } from '../../services/dom/dom.service';
import { SafeApplicationDropdownComponent } from '../../components/application-dropdown/application-dropdown.component';
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
    iconName: 'icon-users',
    category: 'Custom Questions',
    questionJSON: {
      name: 'users',
      type: 'tagbox',
      optionsCaption: 'Select users...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    onInit: (): void => {
      Survey.Serializer.addProperty('users', {
        name: 'applications',
        category: 'Users properties',
        type: 'applicationsDropdown',
        isDynamicChoices: true,
        visibleIndex: 3,
        required: true,
      });

      const applicationEditor = {
        render: (editor: any, htmlElement: any) => {
          const question = editor.object;
          const dropdown = domService.appendComponentToBody(
            SafeApplicationDropdownComponent,
            htmlElement
          );
          const instance: SafeApplicationDropdownComponent = dropdown.instance;
          instance.value = question.applications;
          instance.choice.subscribe((res) => editor.onChanged(res));
        },
      };

      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'applicationsDropdown',
        applicationEditor
      );
    },
    onLoaded: (question: any): void => {
      apollo
        .query<GetUsersQueryResponse>({
          query: GET_USERS,
          variables: {
            applications: question.applications,
          },
        })
        .subscribe(({ data }) => {
          if (data.users) {
            const users: any = [];
            for (const user of data.users) {
              if (!users.some((el: any) => el.value === user.id)) {
                users.push({ value: user.id, text: user.username });
              }
            }
            question.contentQuestion.choices = users;
          }
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAfterRender: (): void => {},
  };
  Survey.ComponentCollection.Instance.add(component);
};
