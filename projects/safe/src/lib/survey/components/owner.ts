import { Apollo } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GetApplicationsQueryResponse, GetRolesQueryResponse, GET_APPLICATIONS, GET_ROLES } from '../../graphql/queries';
import { Application } from '../../models/application.model';
import { BehaviorSubject } from 'rxjs';
import * as SurveyCreator from 'survey-creator';

export function init(Survey: any, apollo: Apollo, dialog: MatDialog, formBuilder: FormBuilder): void {

    const getApplications = () => apollo.query<GetApplicationsQueryResponse>({
        query: GET_APPLICATIONS,
    });

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
        applications: new BehaviorSubject<Application[]>([]),
        onInit: function(): void {
            Survey.Serializer.addProperty('owner', {
                name: 'applications:set',
                category: 'Owner properties',
                isDynamicChoices: true,
                visibleIndex: 3,
                required: true,
                choices: () => {
                    return this.applications.value.map(application => ({ value: application.id, text: application.name }));
                }
            });
            const setGridFieldsBtn = {
                render: (editor: any, htmlElement: any) => {
                  const btn = document.createElement('button');
                  btn.innerText = 'Available grid fields';
                  btn.style.width = '100%';
                  btn.style.border = 'none';
                  btn.style.padding = '10px';
                  htmlElement.appendChild(btn);
                  btn.onclick = (ev: any) => {
                    const currentQuestion = editor.object;
                    currentQuestion.gridFieldsSettings = '';
                  };
                }
              };

            // SurveyCreator`
            //     .SurveyPropertyEditorFactory
            //     .registerCustomEditor('availableFieldsBtn', setGridFieldsBtn);
        },
        onLoaded(question: any): void {
            getApplications().subscribe(
                (res) => {
                    const applications = res.data.applications;
                    this.applications.next(applications);
                    const roles = [];
                    for (const application of applications.filter(x => question.applications.includes(x.id))) {
                        if (application.roles && application.roles.length > 0) {
                            for (const role of application.roles) {
                                roles.push({ value: role.id, text: `${application.name} - ${role.title}` });
                            }
                        }
                    }
                    question.contentQuestion.choices = roles;
                }
            );
        },
        onAfterRender(question: any, el: any): void {

        }
    };
    Survey.ComponentCollection.Instance.add(component);
}
