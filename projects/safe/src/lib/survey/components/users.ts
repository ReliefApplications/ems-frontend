import { Apollo } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator';
import { DomService } from '../../services/dom.service';
import { SafeApplicationDropdownComponent } from '../../components/application-dropdown/application-dropdown.component';
import { GetUsersFromApplicationsQueryResponse, GET_USERS_FROM_APPLICATIONS } from '../../graphql/queries';

/**
 * Inits the owner component.
 * @param Survey Survey class.
 * @param domService Dom service.
 * @param apollo Apollo client.
 * @param dialog Dialog service.
 * @param formBuilder Form Builder service.
 */
export function init(Survey: any, domService: DomService, apollo: Apollo, dialog: MatDialog, formBuilder: FormBuilder): void {

    const component = {
        name: 'users',
        title: 'Users',
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
                required: true
            });

            const applicationEditor = {
                render: (editor: any, htmlElement: any) => {
                    const question = editor.object;
                    const dropdown = domService.appendComponentToBody(SafeApplicationDropdownComponent, htmlElement);
                    const instance: SafeApplicationDropdownComponent = dropdown.instance;
                    instance.value = question.applications;
                    instance.choice.subscribe(res => {
                        return editor.onChanged(res);
                    });
                }
            };

            SurveyCreator
                .SurveyPropertyEditorFactory
                .registerCustomEditor('applicationsDropdown', applicationEditor);
        },
        onLoaded(question: any): void {
            apollo.query<GetUsersFromApplicationsQueryResponse>({
                query: GET_USERS_FROM_APPLICATIONS,
                variables: {
                    applications:  question.applications
                }
            }).subscribe(
                (res) => {
                    if (res.data.usersFromApplications) {
                        const users: any = [];
                        for (const app of res.data.usersFromApplications) {
                            if (app.users) {
                                for (const user of app.users) {
                                    if (!users.some((el: any) => el.value === user.id)) {
                                        users.push({ value: user.id, text: user.username });
                                    }
                                }
                            }
                        }
                        question.contentQuestion.choices = users;
                    }
                }
            );
        },
        onAfterRender(question: any, el: any): void {}
    };
    Survey.ComponentCollection.Instance.add(component);
}
