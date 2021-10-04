import { Apollo } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator';
import { Application } from '../../models/application.model';
import { BehaviorSubject } from 'rxjs';
import { DomService } from '../../services/dom.service';
import { SafeApplicationDropdownComponent } from '../../components/application-dropdown/application-dropdown.component';

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
        // tslint:disable-next-line: object-literal-shorthand
        onInit: (): void => {
            Survey.Serializer.addProperty('owner', {
                name: 'applications',
                category: 'Owner properties',
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
            // getApplications().subscribe(
            //     (res) => {
            //         const applications = res.data.applications;
            //         this.applications.next(applications);
            //         const roles = [];
            //         for (const application of applications.filter(x => question.applications.includes(x.id))) {
            //             if (application.roles && application.roles.length > 0) {
            //                 for (const role of application.roles) {
            //                     roles.push({ value: role.id, text: `${application.name} - ${role.title}` });
            //                 }
            //             }
            //         }
            //         question.contentQuestion.choices = roles;
            //     }
            // );
        },
        onAfterRender(question: any, el: any): void {}
    };
    Survey.ComponentCollection.Instance.add(component);
}
