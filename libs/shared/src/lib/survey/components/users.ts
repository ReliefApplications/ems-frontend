import { ComponentCollection, Serializer, SvgRegistry } from 'survey-core';
import { registerCustomPropertyEditor } from './utils/component-register';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';
import { QuestionUsers } from '../types';
import { DomService } from '../../services/dom/dom.service';
import { UsersDropdownComponent } from './users-dropdown/users-dropdown.component';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import {
  AddUsersMutationResponse,
  RolesFromApplicationsQueryResponse,
  User,
} from '../../models/user.model';
import { ADD_USERS } from '../graphql/mutations';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { GET_ROLES_FROM_APPLICATION } from '../graphql/queries';

/**
 * Inits the users component.
 *
 * @param componentCollectionInstance ComponentCollection
 * @param domService DOM service.
 * @param dialog Dialog service.
 * @param apollo Apollo service.
 * @param snackBar Snackbar service.
 * @param translate Translate service.
 */
export const init = (
  componentCollectionInstance: ComponentCollection,
  domService: DomService,
  dialog: Dialog,
  apollo: Apollo,
  snackBar: SnackbarService,
  translate: TranslateService
): void => {
  /**
   * Opens the invite users modal for the selected application.
   *
   * @param applicationId The id of the application to open the invite users modal for.
   * @returns The list of user ids that were invited.
   */
  const inviteUserFromApplication = async (
    applicationId: string
  ): Promise<User[]> => {
    // Get the roles from the application ID
    const res = await firstValueFrom(
      apollo.query<RolesFromApplicationsQueryResponse>({
        query: GET_ROLES_FROM_APPLICATION,
        variables: { application: applicationId },
      })
    );

    const roles = res.data.rolesFromApplications ?? [];

    const { InviteUsersModalComponent } = await import(
      '../../components/users/public-api'
    );

    const dialogRef = dialog.open(InviteUsersModalComponent, {
      data: {
        roles: roles,
        users: [],
        downloadPath: 'download/invite',
        uploadPath: 'upload/invite',
      },
    });

    return new Promise<User[]>((resolve, reject) => {
      dialogRef.closed.subscribe((value: any) => {
        if (value) {
          apollo
            .mutate<AddUsersMutationResponse>({
              mutation: ADD_USERS,
              variables: {
                users: value,
                application: applicationId,
              },
            })
            .subscribe({
              next: ({ errors, data }) => {
                if (!errors) {
                  if (data?.addUsers.length) {
                    snackBar.openSnackBar(
                      translate.instant('components.users.onInvite.plural')
                    );
                  } else {
                    snackBar.openSnackBar(
                      translate.instant('components.users.onInvite.singular')
                    );
                  }

                  resolve(data?.addUsers ?? []);
                } else {
                  if (value.length > 1) {
                    snackBar.openSnackBar(
                      translate.instant('components.users.onNotInvite.plural', {
                        error: errors[0].message,
                      }),
                      { error: true }
                    );
                  } else {
                    snackBar.openSnackBar(
                      translate.instant(
                        'components.users.onNotInvite.singular',
                        {
                          error: errors[0].message,
                        }
                      ),
                      { error: true }
                    );
                  }

                  reject(errors);
                }
              },
            });
        }
      });
    });
  };

  // Registers icon-users in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
    'users',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z"/></svg>'
  );
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
      Serializer.addProperty('users', {
        name: 'applications',
        category: 'Users properties',
        type: CustomPropertyGridComponentTypes.applicationsDropdown,
        // isDynamicChoices: true,
        visibleIndex: 3,
        isRequired: true,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.applicationsDropdown
      );

      // Add 'invite users' property
      Serializer.addProperty('users', {
        name: 'inviteUsers:boolean',
        category: 'Users properties',
        default: false,
        visibleIndex: 4,
        visibleIf: (obj: null | QuestionUsers) =>
          !!obj?.applications && obj.applications.length === 1,
      });
    },
    onAfterRender: async (question: QuestionUsers, el: HTMLElement) => {
      // Hides the tagbox element
      const element =
        el.getElementsByTagName('kendo-multiselect')[0].parentElement;
      if (element) {
        element.style.display = 'none';
      }

      // Users that are already selected
      const selectedUserIDs: string[] = Array.isArray(question.value)
        ? question.value
        : [];

      // Appends users dropdown to the question html element
      const userDropdown = domService.appendComponentToBody(
        UsersDropdownComponent,
        el
      );

      const instance: UsersDropdownComponent = userDropdown.instance;
      // Filter by applications
      instance.applications = question.applications;

      // Initial selection
      instance.initialSelectionIDs = selectedUserIDs;

      // Updates the question value when the selection changes
      instance.selectionChange.subscribe((value: string[]) => {
        question.value = value;
      });

      if (question.isReadOnly) {
        instance.control.disable();
      }

      question.registerFunctionOnPropertyValueChanged(
        'readOnly',
        (value: boolean) => {
          if (value) {
            instance.control.disable();
          } else {
            instance.control.enable();
          }
        }
      );

      // Add invite users button, if configured
      if (question.inviteUsers && question.applications?.length === 1) {
        // Create a button to invite users
        const inviteButton = document.createElement('button');
        inviteButton.classList.add('sd-btn', '!px-3', '!py-1');
        inviteButton.innerText = translate.instant(
          'components.users.invite.add'
        );

        inviteButton.onclick = async () => {
          const applicationId = question.applications[0];
          const addedUser = await inviteUserFromApplication(applicationId);
          const addedUserIds = addedUser.map((user) => user.id);
          // Update the questions value and the dropdown selection
          question.value = question.value.concat(addedUserIds);
          instance.control.setValue(question.value);
          // Refresh the dropdown options
          instance.reloadSelectedUsers();
        };

        // Append it to the header
        const header = el.querySelector(
          '.sd-question__header'
        ) as HTMLDivElement;
        header.appendChild(inviteButton);
      }
    },
  };
  componentCollectionInstance.add(component);
};
