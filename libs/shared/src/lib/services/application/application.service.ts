import { Apollo } from 'apollo-angular';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  firstValueFrom,
} from 'rxjs';
import {
  AddRoleMutationResponse,
  DeleteRoleMutationResponse,
  DeleteUsersFromApplicationMutationResponse,
  EditRoleMutationResponse,
  Role,
} from '../../models/user.model';
import {
  Page,
  ContentType,
  DeletePageMutationResponse,
  RestorePageMutationResponse,
  EditPageMutationResponse,
  AddPageMutationResponse,
  DuplicatePageMutationResponse,
} from '../../models/page.model';
import {
  Application,
  ApplicationEditedSubscriptionResponse,
  ApplicationQueryResponse,
  ApplicationUnlockedSubscriptionResponse,
  EditApplicationMutationResponse,
  ToggleApplicationLockMutationResponse,
} from '../../models/application.model';
import {
  AddChannelMutationResponse,
  Channel,
  DeleteChannelMutationResponse,
  EditChannelMutationResponse,
} from '../../models/channel.model';
import { HttpHeaders } from '@angular/common/http';
import {
  ADD_PAGE,
  ADD_ROLE,
  DELETE_PAGE,
  DELETE_ROLE,
  EDIT_APPLICATION,
  EDIT_ROLE,
  ADD_CHANNEL,
  DELETE_CHANNEL,
  ADD_SUBSCRIPTION,
  EDIT_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  ADD_POSITION_ATTRIBUTE_CATEGORY,
  DELETE_USERS_FROM_APPLICATION,
  DELETE_POSITION_ATTRIBUTE_CATEGORY,
  EDIT_POSITION_ATTRIBUTE_CATEGORY,
  EDIT_CHANNEL,
  TOGGLE_APPLICATION_LOCK,
  DUPLICATE_PAGE,
  ADD_TEMPLATE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
  UPDATE_DISTRIBUTION_LIST,
  ADD_DISTRIBUTION_LIST,
  DELETE_DISTRIBUTION_LIST,
  EDIT_PAGE,
  ADD_CUSTOM_NOTIFICATION,
  DELETE_CUSTOM_NOTIFICATION,
  RESTORE_PAGE,
} from './graphql/mutations';
import { GET_APPLICATION_BY_ID } from './graphql/queries';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';
import {
  APPLICATION_EDITED_SUBSCRIPTION,
  APPLICATION_UNLOCKED_SUBSCRIPTION,
} from './graphql/subscriptions';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {
  AddTemplateMutationResponse,
  DeleteTemplateMutationResponse,
  Template,
  UpdateTemplateMutationResponse,
} from '../../models/template.model';
import {
  AddDistributionListMutationResponse,
  DeleteDistributionListMutationResponse,
  DistributionList,
  UpdateDistributionListMutationResponse,
} from '../../models/distribution-list.model';
import {
  AddCustomNotificationMutationResponse,
  CustomNotification,
  DeleteCustomNotificationMutationResponse,
  UpdateCustomNotificationMutationResponse,
} from '../../models/custom-notification.model';
import { UPDATE_CUSTOM_NOTIFICATION } from '../application-notifications/graphql/mutations';
import {
  SnackbarService,
  UILayoutService,
  faV4toV6Mapper,
} from '@oort-front/ui';
import {
  AddPositionAttributeCategoryMutationResponse,
  DeletePositionAttributeCategoryMutationResponse,
  EditPositionAttributeCategoryMutationResponse,
} from '../../models/position-attribute.model';
import {
  AddSubscriptionMutationResponse,
  DeleteSubscriptionMutationResponse,
  EditSubscriptionMutationResponse,
} from '../../models/subscription.model';
import { RestService } from '../rest/rest.service';
import { DownloadService } from '../download/download.service';
import { DOCUMENT } from '@angular/common';
import { GraphQLError } from 'graphql';

/**
 * Shared application service. Handles events of opened application.
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  /** Current application */
  public application = new BehaviorSubject<Application | null>(null);

  /** @returns Current application as observable */
  get application$(): Observable<Application | null> {
    return this.application.asObservable();
  }

  /** Application query subscription */
  private applicationSubscription?: Subscription;
  /** Notifications query subscription */
  private notificationSubscription?: Subscription;
  /** Edit right subscription */
  private lockSubscription?: Subscription;
  /** Current environment */
  private environment: any;

  /** Application custom style */
  public rawCustomStyle?: string;
  public customStyle?: HTMLStyleElement;
  public customStyleEdited = false;

  /** @returns Path to download application users */
  get usersDownloadPath(): string {
    const id = this.application.getValue()?.id;
    return `download/application/${id}/invite`;
  }

  /** @returns Path to upload application users */
  get usersUploadPath(): string {
    const id = this.application.getValue()?.id;
    return `upload/application/${id}/invite`;
  }

  /** @returns Edit status of the application */
  get isUnlocked(): boolean {
    const application = this.application.getValue();
    if (application) {
      if (application?.locked && !application.lockedByUser) {
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectLocked', {
            name: application.name,
          })
        );
        return false;
      }
    }
    return true;
  }

  /** @returns Name of the current application */
  get name(): string {
    return this.application.value?.name || '';
  }

  /** @returns Current application's templates */
  get templates(): Template[] {
    return this.application.value?.templates || [];
  }

  /** @returns Current application's distributionList */
  get distributionLists(): DistributionList[] {
    return this.application.value?.distributionLists || [];
  }

  /**
   * Creates an instance of ApplicationService.
   *
   * @param {any} environment - The environment configuration object.
   * @param {Apollo} apollo - The Apollo client service.
   * @param {SnackbarService} snackBar - The Snackbar service.
   * @param {AuthService} authService - The authentication service.
   * @param {Router} router - The router service.
   * @param {TranslateService} translate - The translation service.
   * @param {UILayoutService} layoutService - The UI layout service.
   * @param {RestService} restService - The REST API service.
   * @param {DownloadService} downloadService - The download service.
   * @param {Document} document - The Document object.
   * @memberof ApplicationService
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private layoutService: UILayoutService,
    private restService: RestService,
    private downloadService: DownloadService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.environment = environment;
  }

  /**
   * Gets the application from the database, using GraphQL.
   *
   * @param id application id
   * @param asRole Role to use to preview
   */
  loadApplication(id: string, asRole?: string): void {
    // First make sure we close the opened application, if any
    if (this.application.getValue()) {
      this.leaveApplication();
    }
    // Then, open the new application
    this.applicationSubscription = this.apollo
      .query<ApplicationQueryResponse>({
        query: GET_APPLICATION_BY_ID,
        variables: {
          id,
          asRole,
        },
      })
      .subscribe(async ({ data }) => {
        // extend user abilities for application
        if (data.application) {
          // Map all previously configured icons in v4 to v6 so on application edit, new icons are saved in DB
          data.application.pages?.map((page: Page) => {
            if (faV4toV6Mapper[page.icon as string]) {
              (page as Page).icon = faV4toV6Mapper[page.icon as string];
            }
            return page;
          });
          this.authService.extendAbilityForApplication(data.application);
        }
        await this.getCustomStyle(data.application);
        this.application.next(data.application);
        const application = this.application.getValue();
        if (data.application?.locked) {
          if (!application?.lockedByUser) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectLocked', {
                name: data.application.name,
              })
            );
          }
        }
      });
    this.notificationSubscription = this.apollo
      .subscribe<ApplicationEditedSubscriptionResponse>({
        query: APPLICATION_EDITED_SUBSCRIPTION,
        variables: {
          id,
        },
      })
      .subscribe(() => {
        const snackBar = this.snackBar.openSnackBar(
          this.translate.instant('models.application.notifications.updated'),
          {
            action: 'Reload',
            duration: 0,
          }
        );
        snackBar.instance.actionComplete.subscribe(() =>
          window.location.reload()
        );
      });
    this.lockSubscription = this.apollo
      .subscribe<ApplicationUnlockedSubscriptionResponse>({
        query: APPLICATION_UNLOCKED_SUBSCRIPTION,
        variables: {
          id,
        },
      })
      .subscribe(({ data }) => {
        if (data?.applicationUnlocked) {
          const application = this.application.getValue();
          const newApplication = {
            ...application,
            locked: data?.applicationUnlocked?.locked,
            lockedByUser: data?.applicationUnlocked?.lockedByUser,
          };
          this.application.next(newApplication);
        }
      });
  }

  /**
   * Leaves application and unsubscribe to application changes.
   */
  leaveApplication(): void {
    if (this.customStyle) {
      this.document
        .getElementsByTagName('head')[0]
        .removeChild(this.customStyle);
      this.rawCustomStyle = undefined;
      this.customStyle = undefined;
      this.layoutService.closeRightSidenav = true;
    }
    const application = this.application.getValue();
    this.application.next(null);
    this.applicationSubscription?.unsubscribe();
    this.notificationSubscription?.unsubscribe();
    this.lockSubscription?.unsubscribe();
    this.apollo
      .mutate<ToggleApplicationLockMutationResponse>({
        mutation: TOGGLE_APPLICATION_LOCK,
        variables: {
          id: application?.id,
          lock: false,
        },
      })
      .subscribe();
  }

  /**
   * Toggles application lock.
   */
  toggleApplicationLock(): void {
    const application = this.application.getValue();
    const locked = application?.locked;
    if (locked === undefined) return;
    this.apollo
      .mutate<ToggleApplicationLockMutationResponse>({
        mutation: TOGGLE_APPLICATION_LOCK,
        variables: {
          id: application?.id,
          lock: !locked,
        },
      })
      .subscribe(({ data }) => {
        if (data?.toggleApplicationLock) {
          if (!data.toggleApplicationLock.lockedByUser) {
            const newApplication = {
              ...application,
              locked: data?.toggleApplicationLock?.locked,
              lockedByUser: data?.toggleApplicationLock.lockedByUser,
            };
            this.application.next(newApplication);
          }
        }
      });
  }

  /**
   * Edits current application.
   *
   * @param value New application value.
   */
  editApplication(value: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditApplicationMutationResponse>({
          mutation: EDIT_APPLICATION,
          variables: {
            id: application?.id,
            name: value.name,
            description: value.description,
            sideMenu: value.sideMenu,
            status: value.status,
          },
        })
        .subscribe(({ errors, data }) => {
          this.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.application.one'),
            value.name
          );
          if (!errors && data && data.editApplication) {
            if (data?.editApplication) {
              const newApplication = {
                ...application,
                name: data.editApplication.name,
                description: data.editApplication.description,
                sideMenu: value.sideMenu,
                status: data.editApplication.status,
              };
              this.application.next(newApplication);
            }
          }
        });
    }
  }

  /**
   * Edits current permissions.
   *
   * @param newPermissions New application value.
   */
  editPermissions(newPermissions: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditApplicationMutationResponse>({
          mutation: EDIT_APPLICATION,
          variables: {
            id: application?.id,
            permissions: newPermissions,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            this.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.access'),
              application?.name
            );
            if (!errors && data?.editApplication) {
              const newApplication = {
                ...application,
                permissions: data.editApplication.permissions,
              };
              this.application.next(newApplication);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Updates the application status to published.
   */
  publish(): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditApplicationMutationResponse>({
          mutation: EDIT_APPLICATION,
          variables: {
            id: application.id,
            status: 'active',
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'models.application.notifications.notPublished'
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'models.application.notifications.published',
                    {
                      value: data.editApplication.name,
                    }
                  )
                );
                this.router.navigate(['/applications']);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Deletes a page and the associated content.
   *
   * @param id id of the page
   * @param stayOnPage true if you do not want to be redirected
   */
  deletePage(id: string, stayOnPage = false): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeletePageMutationResponse>({
          mutation: DELETE_PAGE,
          variables: {
            id,
          },
        })
        .subscribe(({ errors, data }) => {
          if (data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: this.translate.instant('common.page.one'),
              })
            );
            const app = this.application.getValue();
            if (app) {
              const newApplication = {
                ...app,
                pages: app.pages?.filter((x) => x.id !== data?.deletePage.id),
              };
              this.application.next(newApplication);
              if (!stayOnPage) {
                this.router.navigate([`./applications/${app.id}`]);
              }
            }
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotDeleted', {
                value: this.translate.instant('common.page.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          }
        });
    }
  }

  /**
   * Restore a page and the associated content.
   *
   * @param id id of the page
   */
  restorePage(id: string) {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<RestorePageMutationResponse>({
          mutation: RESTORE_PAGE,
          variables: {
            id,
          },
        })
        .subscribe(({ errors, data }) => {
          if (data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectRestored', {
                value: this.translate.instant('common.page.one'),
              })
            );
            const application = this.application.getValue();
            if (application) {
              const newApplication = {
                ...application,
                pages: application.pages?.concat([data.restorePage]),
              };
              this.application.next(newApplication);
              this.router.navigate([
                data.restorePage.type === ContentType.form
                  ? `/applications/${application.id}/${data.restorePage.type}/${data.restorePage.id}`
                  : `/applications/${application.id}/${data.restorePage.type}/${data.restorePage.content}`,
              ]);
            }
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotRestored', {
                value: this.translate.instant('common.page.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          }
        });
    }
  }

  /**
   * Reorders the pages.
   *
   * @param pages new pages order
   */
  reorderPages(pages: string[]): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditApplicationMutationResponse>({
          mutation: EDIT_APPLICATION,
          variables: {
            id: application?.id,
            pages,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              if (pages.length > 1) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.application.pages.notReordered.plural',
                    { error: errors ? errors[0].message : '' }
                  ),
                  { error: true }
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.application.pages.notReordered.singular',
                    { error: errors ? errors[0].message : '' }
                  ),
                  { error: true }
                );
              }
            } else {
              if (pages.length > 1) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.application.pages.reordered.plural'
                  )
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.application.pages.reordered.singular'
                  )
                );
              }

              this.application.next({
                ...application,
                ...{ pages: data?.editApplication.pages },
              });
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Updates a specific page name in the opened application.
   *
   * @param page updated page
   * @param callback additional callback
   */
  updatePageName(page: Page, callback?: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: page.id,
            name: page.name,
          },
        })
        .subscribe(({ errors, data }) => {
          this.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.page.one'),
            page.name
          );
          if (!errors && data) {
            const newApplication = {
              ...application,
              pages: application.pages?.map((x) => {
                if (x.id === page.id) {
                  x = { ...x, name: page.name };
                }
                return x;
              }),
            };
            this.application.next(newApplication);
            if (callback) callback();
          }
        });
    }
  }

  /**
   * Toggle page visibility
   * It is about if a page can be seen or not in front-office, in the navbar. Thus, if a page is hidden, it is still accessible through url.
   *
   * @param page page to hide / show
   * @param callback callback method
   */
  togglePageVisibility(page: Page, callback?: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: page.id,
            visible: page.visible,
          },
        })
        .subscribe(({ errors, data }) => {
          this.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.page.one')
          );
          if (!errors && data) {
            const newApplication = {
              ...application,
              pages: application.pages?.map((x) => {
                if (x.id === page.id) {
                  x = { ...x, visible: data.editPage.visible };
                }
                return x;
              }),
            };
            this.application.next(newApplication);
            if (callback) callback();
          }
        });
    }
  }

  /**
   * Change page icon, by sending a mutation to the back-end.
   *
   * @param page Edited page
   * @param icon new icon
   * @param callback callback method, allow the component calling the service to do some logic.
   */
  changePageIcon(page: Page, icon: string, callback?: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: page.id,
            icon,
          },
        })
        .subscribe(({ errors, data }) => {
          this.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.page.one')
          );
          if (!errors && data) {
            const newApplication = {
              ...application,
              pages: application.pages?.map((x) => {
                if (x.id === page.id) {
                  x = { ...x, icon: data.editPage.icon };
                }
                return x;
              }),
            };
            this.application.next(newApplication);
            if (callback) callback();
          }
        });
    }
  }

  /**
   * Adds a new page to the opened application.
   *
   * @param page new page
   * @param structure page structure ( only for new dashboard pages )
   */
  addPage(page: any, structure?: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddPageMutationResponse>({
          mutation: ADD_PAGE,
          variables: {
            type: page.type,
            content: page.content,
            application: application.id,
            structure,
          },
        })
        .subscribe(({ errors, data }) => {
          if (data?.addPage) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectCreated', {
                type: this.translate.instant('common.page.one').toLowerCase(),
                value: data.addPage.name,
              })
            );

            const content = data.addPage.content;
            const newApplication = {
              ...application,
              pages: application.pages?.concat([data.addPage]),
            };
            this.application.next(newApplication);
            this.router.navigate([
              page.type === ContentType.form
                ? `/applications/${application.id}/${page.type}/${data.addPage.id}`
                : `/applications/${application.id}/${page.type}/${content}`,
            ]);
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotCreated', {
                type: this.translate.instant('common.page.one').toLowerCase(),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          }
        });
    }
  }

  /**
   * Duplicates page in the indicated application.
   *
   * @param applicationId id of the application where it should be duplicated
   * @param content content to duplicate
   * @param content.stepId id of step to duplicate
   * @param content.pageId id of page to duplicate
   * @param callback additional callback
   */
  duplicatePage(
    applicationId: string,
    content: { stepId?: string; pageId?: string },
    callback: any
  ): void {
    this.apollo
      .mutate<DuplicatePageMutationResponse>({
        mutation: DUPLICATE_PAGE,
        variables: {
          application: applicationId,
          page: content.pageId,
          step: content.stepId,
        },
      })
      .subscribe(({ errors, data }) => {
        if (errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotCreated', {
              type: this.translate.instant('common.page.one').toLowerCase(),
              error: errors ? errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          if (data?.duplicatePage) {
            const newPage = data.duplicatePage;
            this.translate.instant('common.notifications.objectCreated', {
              type: this.translate.instant('common.page.one').toLowerCase(),
              value: newPage?.name,
            });
            const application = this.application.getValue();
            if (applicationId === application?.id) {
              const newApplication = {
                ...application,
                pages: application.pages?.concat([newPage]),
              };
              this.application.next(newApplication);
            }
            this.router.navigate([
              `/applications/${applicationId}/${newPage?.type}/${newPage?.content}`,
            ]);
            if (callback) callback();
          }
        }
      });
  }

  /**
   * Adds a new role to the opened application.
   *
   * @param role new role
   */
  addRole(role: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddRoleMutationResponse>({
          mutation: ADD_ROLE,
          variables: {
            title: role.title,
            application: application.id,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotCreated',
                  {
                    type: this.translate
                      .instant('common.role.one')
                      .toLowerCase(),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.role.one')
                      .toLowerCase(),
                    value: role.title,
                  })
                );
                const newApplication = {
                  ...application,
                  roles: application.roles?.concat([data.addRole]),
                };
                this.application.next(newApplication);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Edits an existing role.
   *
   * @param role role to edit
   * @param value new value
   */
  editRole(role: Role, value: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditRoleMutationResponse>({
          mutation: EDIT_ROLE,
          variables: {
            id: role.id,
            permissions: value.permissions,
            channels: value.channels,
            title: value.title,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            this.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.role.one'),
              role.title
            );
            if (!errors && data) {
              const newApplication: Application = {
                ...application,
                roles: application.roles?.map((x) => {
                  if (x.id === role.id) {
                    x = {
                      ...x,
                      permissions: data?.editRole.permissions,
                      channels: data?.editRole.channels,
                    };
                  }
                  return x;
                }),
                channels: application.channels?.map((x) => {
                  if (value.channels.includes(x.id)) {
                    x = {
                      ...x,
                      subscribedRoles: x.subscribedRoles?.concat([role]),
                    };
                  } else if (
                    x.subscribedRoles?.some((subRole) => subRole.id === role.id)
                  ) {
                    x = {
                      ...x,
                      subscribedRoles: x.subscribedRoles.filter(
                        (subRole) => subRole.id !== role.id
                      ),
                    };
                  }
                  return x;
                }),
              };
              this.application.next(newApplication);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Deletes an existing role.
   *
   * @param role Role to delete.
   */
  deleteRole(role: Role): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeleteRoleMutationResponse>({
          mutation: DELETE_ROLE,
          variables: {
            id: role.id,
          },
        })
        .subscribe({
          next: ({ errors }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: role.title,
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: role.title,
                })
              );
              const newApplication = {
                ...application,
                roles: application.roles?.filter((x) => x.id !== role.id),
              };
              this.application.next(newApplication);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Deletes users of the opened application. Users are only removed from the application, but are still active.
   *
   * @param ids user ids to remove
   * @param resolved status of the request
   */
  deleteUsersFromApplication(ids: any[], resolved: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeleteUsersFromApplicationMutationResponse>({
          mutation: DELETE_USERS_FROM_APPLICATION,
          variables: {
            ids,
            application: application.id,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              if (ids.length > 1) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.users.onNotDelete.plural',
                    { error: errors ? errors[0].message : '' }
                  ),
                  { error: true }
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.users.onNotDelete.singular',
                    { error: errors ? errors[0].message : '' }
                  ),
                  { error: true }
                );
              }
            } else {
              if (data) {
                const deletedUsers = data.deleteUsersFromApplication.map(
                  (x) => x.id
                );
                if (deletedUsers.length > 1) {
                  this.snackBar.openSnackBar(
                    this.translate.instant('components.users.onDelete.plural')
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant('components.users.onDelete.singular')
                  );
                }
              } else {
                if (ids.length > 1) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotDelete.plural',
                      { error: '' }
                    ),
                    { error: true }
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotDelete.singular',
                      { error: '' }
                    ),
                    { error: true }
                  );
                }
              }
            }
            resolved();
          },
        });
    }
  }

  /**
   * Download application users
   *
   * @param type export type
   * @param users list of users ids
   */
  downloadUsers(type: 'csv' | 'xlsx', users: string[] = []): void {
    const application = this.application.getValue();
    if (application) {
      this.downloadService.getUsersExport(type, users, application);
    }
  }

  /**
   * Adds a new position to the opened application.
   *
   * @param category new category
   */
  addPositionAttributeCategory(category: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddPositionAttributeCategoryMutationResponse>({
          mutation: ADD_POSITION_ATTRIBUTE_CATEGORY,
          variables: {
            title: category.title,
            application: application.id,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotCreated',
                  {
                    type: this.translate
                      .instant('common.positionCategory.one')
                      .toLowerCase(),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.positionCategory.one')
                      .toLowerCase(),
                    value: category.title,
                  })
                );
                const newApplication: Application = {
                  ...application,
                  positionAttributeCategories:
                    application.positionAttributeCategories?.concat([
                      data.addPositionAttributeCategory,
                    ]),
                };
                this.application.next(newApplication);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Removes a position from the opened application.
   *
   * @param category category to remove
   */
  deletePositionAttributeCategory(category: PositionAttributeCategory): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeletePositionAttributeCategoryMutationResponse>({
          mutation: DELETE_POSITION_ATTRIBUTE_CATEGORY,
          variables: {
            id: category.id,
            application: application.id,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: category.title,
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: category.title,
                  })
                );
                const newApplication: Application = {
                  ...application,
                  positionAttributeCategories:
                    application.positionAttributeCategories?.filter(
                      (x) => x.id !== data?.deletePositionAttributeCategory.id
                    ),
                };
                this.application.next(newApplication);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Edits a position's name from the opened application.
   *
   * @param value new value
   * @param category category to edit
   */
  editPositionAttributeCategory(
    value: any,
    category: PositionAttributeCategory
  ): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditPositionAttributeCategoryMutationResponse>({
          mutation: EDIT_POSITION_ATTRIBUTE_CATEGORY,
          variables: {
            id: category.id,
            application: application.id,
            title: value.title,
          },
        })
        .subscribe(({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.errors.objectDuplicated', {
                type: this.translate
                  .instant('common.positionCategory.one')
                  .toLowerCase(),
                value: value.title,
              }),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.positionCategory.one'),
                value: value.title,
              })
            );
            const newApplication: Application = {
              ...application,
              positionAttributeCategories:
                application.positionAttributeCategories?.map((pos) => {
                  if (pos.title === category.title) {
                    pos = {
                      ...pos,
                      title: data?.editPositionAttributeCategory.title,
                    };
                  }
                  return pos;
                }),
            };
            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Adds a new channel to the application.
   *
   * @param channel new channel
   * @param channel.title title of the channel
   */
  addChannel(channel: { title: string }): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddChannelMutationResponse>({
          mutation: ADD_CHANNEL,
          variables: {
            title: channel.title,
            application: application.id,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotCreated',
                  {
                    type: this.translate
                      .instant('common.channel.one')
                      .toLowerCase(),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.channel.one')
                      .toLowerCase(),
                    value: channel.title,
                  })
                );
                const newApplication: Application = {
                  ...application,
                  channels: application.channels?.concat([data.addChannel]),
                };
                this.application.next(newApplication);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Edits a channel's title.
   *
   * @param channel channel to edit
   * @param title new title
   */
  editChannel(channel: Channel, title: string): void {
    const application = this.application.getValue();
    this.apollo
      .mutate<EditChannelMutationResponse>({
        mutation: EDIT_CHANNEL,
        variables: {
          id: channel.id,
          title,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          this.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.channel.one'),
            title
          );
          if (!errors && data) {
            const newApplication: Application = {
              ...application,
              channels: application?.channels?.map((x) => {
                if (x.id === channel.id) {
                  x = { ...x, title: data?.editChannel.title };
                }
                return x;
              }),
            };
            this.application.next(newApplication);
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Removes a channel from the system with all notifications linked to it.
   *
   * @param channel channel to delete
   */
  deleteChannel(channel: Channel): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeleteChannelMutationResponse>({
          mutation: DELETE_CHANNEL,
          variables: {
            id: channel.id,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: channel.title,
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: channel.title,
                  })
                );
                const newApplication: Application = {
                  ...application,
                  channels: application.channels?.filter(
                    (x) => x.id !== data?.deleteChannel.id
                  ),
                };
                this.application.next(newApplication);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Adds a new subscription to the application.
   *
   * @param subscription new subscription
   * @param subscription.routingKey routing key of the subscription
   * @param subscription.title title of the subscription
   * @param subscription.convertTo the format in which we want to convert
   * @param subscription.channel the channel where to send subscriptions
   */
  addSubscription(subscription: {
    routingKey: string;
    title: string;
    convertTo: string;
    channel: string;
  }): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddSubscriptionMutationResponse>({
          mutation: ADD_SUBSCRIPTION,
          variables: {
            application: application.id,
            routingKey: subscription.routingKey,
            title: subscription.title,
            convertTo: subscription.convertTo,
            channel: subscription.channel,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotCreated',
                  {
                    type: this.translate
                      .instant('common.subscription.one')
                      .toLowerCase(),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.subscription.one')
                      .toLowerCase(),
                    value: subscription.title,
                  })
                );
                const newApplication: Application = {
                  ...application,
                  subscriptions: application.subscriptions?.concat([
                    data.addSubscription,
                  ]),
                };
                this.application.next(newApplication);
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Deletes subscription from application.
   *
   * @param subscription subscription to delete
   */
  deleteSubscription(subscription: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeleteSubscriptionMutationResponse>({
          mutation: DELETE_SUBSCRIPTION,
          variables: {
            applicationId: application.id,
            routingKey: subscription,
          },
        })
        .subscribe({
          next: ({ errors }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: this.translate.instant('common.subscription.one'),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate.instant('common.subscription.one'),
                })
              );
              const newApplication = {
                ...application,
                subscriptions: application.subscriptions?.filter(
                  (sub) => sub.routingKey !== subscription
                ),
              };
              this.application.next(newApplication);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Edits existing subscription.
   *
   * @param value new value
   * @param previousSubscription previous subscription
   */
  editSubscription(value: any, previousSubscription: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditSubscriptionMutationResponse>({
          mutation: EDIT_SUBSCRIPTION,
          variables: {
            applicationId: application.id,
            title: value.title,
            routingKey: value.routingKey,
            convertTo: value.convertTo,
            channel: value.channel,
            previousSubscription,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            this.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.subscription.one'),
              value.title
            );
            if (!errors && data) {
              const subscription = data.editSubscription;
              const newApplication = {
                ...application,
                subscriptions: application.subscriptions?.map((sub) => {
                  if (sub.routingKey === previousSubscription) {
                    sub = subscription;
                  }
                  return sub;
                }),
              };
              this.application.next(newApplication);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Moves to the first page of the application.
   */
  goToFirstPage(): void {
    const application = this.application.getValue();
    if (application?.pages && application.pages.length > 0) {
      const page = application.pages[0];
      if (this.environment.module === 'backoffice') {
        this.router.navigate([
          page.type === ContentType.form
            ? `applications/${application.id}/${page.type}/${page.id}`
            : `applications/${application.id}/${page.type}/${page.content}`,
        ]);
      } else {
        this.router.navigate([
          page.type === ContentType.form
            ? `/${page.type}/${page.id}`
            : `/${page.type}/${page.content}`,
        ]);
      }
    }
  }

  /**
   * Adds a new template to the application.
   *
   * @param template new template to be added
   * @param callback additional callback
   */
  addTemplate(template: Template, callback?: any): void {
    const application = this.application.getValue();
    if (application?.id) {
      this.apollo
        .mutate<AddTemplateMutationResponse>({
          mutation: ADD_TEMPLATE,
          variables: {
            application: application.id,
            template: {
              name: template.name,
              type: 'email',
              content: template.content,
            },
          },
        })
        .subscribe(({ data }) => {
          if (data) {
            const newApplication: Application = {
              ...application,
              templates: [...(application.templates || []), data.addTemplate],
            };

            this.application.next(newApplication);
            if (callback) callback(data.addTemplate);
          }
        });
    }
  }

  /**
   * Removes a template by its id.
   *
   * @param id template's id to be deleted
   */
  deleteTemplate(id: string): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeleteTemplateMutationResponse>({
          mutation: DELETE_TEMPLATE,
          variables: {
            application: application.id,
            id,
          },
        })
        .subscribe(({ data }) => {
          if (data) {
            const newApplication: Application = {
              ...application,
              templates: this.templates.filter((t) => t.id !== id),
            };
            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Edits existing template.
   *
   * @param template new template to be added
   */
  editTemplate(template: Template): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<UpdateTemplateMutationResponse>({
          mutation: UPDATE_TEMPLATE,
          variables: {
            application: application.id,
            id: template.id,
            template: {
              name: template.name,
              type: template.type,
              content: template.content,
            },
          },
        })
        .subscribe(({ data }) => {
          if (data?.editTemplate) {
            const updatedTemplate = data.editTemplate;
            const newApplication: Application = {
              ...application,
              templates: application.templates?.map((t) => {
                if (t.id === template.id) {
                  t = updatedTemplate;
                }
                return t;
              }),
            };
            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Edits existing distribution list.
   *
   * @param distributionList distribution list to modify
   */
  editDistributionList(distributionList: DistributionList): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<UpdateDistributionListMutationResponse>({
          mutation: UPDATE_DISTRIBUTION_LIST,
          variables: {
            application: application.id,
            id: distributionList.id,
            distributionList: {
              name: distributionList.name,
              emails: distributionList.emails,
            },
          },
        })
        .subscribe(({ data }) => {
          if (data?.editDistributionList) {
            const updatedDistributionList = data.editDistributionList;
            const newApplication: Application = {
              ...application,
              distributionLists: application.distributionLists?.map((dist) => {
                if (dist.id === distributionList.id) {
                  dist = updatedDistributionList;
                }
                return dist;
              }),
            };
            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Add new distribution list
   *
   * @param distributionList new distribution list to be added
   * @param callback additional callback
   */
  addDistributionList(
    distributionList: DistributionList,
    callback?: any
  ): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddDistributionListMutationResponse>({
          mutation: ADD_DISTRIBUTION_LIST,
          variables: {
            application: application.id,
            distributionList: {
              name: distributionList.name,
              emails: distributionList.emails,
            },
          },
        })
        .subscribe(({ data }) => {
          if (data?.addDistributionList) {
            const newApplication: Application = {
              ...application,
              distributionLists: [
                ...(application.distributionLists || []),
                data.addDistributionList,
              ],
            };
            this.application.next(newApplication);
            if (callback) callback(data.addDistributionList);
          }
        });
    }
  }

  /**
   * Removes a distribution list by its id.
   *
   * @param id template's id to be deleted
   */
  deleteDistributionList(id: string): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeleteDistributionListMutationResponse>({
          mutation: DELETE_DISTRIBUTION_LIST,
          variables: {
            application: application.id,
            id,
          },
        })
        .subscribe(({ data }) => {
          if (data) {
            const newApplication: Application = {
              ...application,
              distributionLists: application.distributionLists?.filter(
                (dist) => dist.id !== id
              ),
            };
            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Add custom notification
   *
   * @param notification notification input
   * @param callback callback method
   */
  addCustomNotification(
    notification: CustomNotification,
    callback?: any
  ): void {
    const application = this.application.getValue();
    if (application) {
      this.apollo
        .mutate<AddCustomNotificationMutationResponse>({
          mutation: ADD_CUSTOM_NOTIFICATION,
          variables: {
            application: application.id,
            notification,
          },
        })
        .subscribe((res) => {
          if (callback) callback(res);
        });
    }
  }

  /**
   * Delete custom notification
   *
   * @param id id of custom notification
   * @param callback callback method
   */
  deleteCustomNotification(id: string, callback?: any): void {
    const application = this.application.getValue();
    if (application) {
      this.apollo
        .mutate<DeleteCustomNotificationMutationResponse>({
          mutation: DELETE_CUSTOM_NOTIFICATION,
          variables: {
            id,
            application: application.id,
          },
        })
        .subscribe((res) => {
          if (callback) callback(res);
        });
    }
  }

  /**
   * Update custom notification
   *
   * @param id id of custom notification
   * @param notification custom notification
   * @param callback callback method
   */
  updateCustomNotification(
    id: string,
    notification: CustomNotification,
    callback?: any
  ): void {
    const application = this.application.getValue();
    if (application) {
      this.apollo
        .mutate<UpdateCustomNotificationMutationResponse>({
          mutation: UPDATE_CUSTOM_NOTIFICATION,
          variables: {
            id,
            application: application.id,
            notification,
          },
        })
        .subscribe((res) => {
          if (callback) callback(res);
        });
    }
  }

  /**
   * Load custom style from application
   *
   * @param application application to open
   * @returns custom styling loading as promise
   */
  getCustomStyle(application: Application): Promise<void> {
    const path = `style/application/${application?.id}`;
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });
    return firstValueFrom(
      this.restService.get(path, { responseType: 'blob', headers })
    )
      .then(async (res) => {
        if (res.type === 'application/octet-stream') {
          const styleFromFile = await res.text();
          const scss = styleFromFile as string;
          this.customStyle = this.document.createElement('style');
          await firstValueFrom(
            this.restService.post(
              'style/scss-to-css',
              { scss },
              { responseType: 'text' }
            )
          )
            .then((css) => {
              if (this.customStyle) {
                this.customStyle.innerText = css;
                this.document
                  .getElementsByTagName('head')[0]
                  .appendChild(this.customStyle);
              }
            })
            .catch(() => {
              if (this.customStyle) {
                this.customStyle.innerText = styleFromFile;
              }
            });

          this.rawCustomStyle = styleFromFile;
        }
      })
      .catch((err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
      })
      .finally(() => (this.customStyleEdited = false));
  }

  /**
   * Handle mutations messages response from the application, pages and steps
   *
   * @param errors errors from the access mutation response if any
   * @param type content type
   * @param value value of the content edited
   */
  handleEditionMutationResponse(
    errors: readonly GraphQLError[] | undefined,
    type: string,
    value?: string
  ) {
    if (errors) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotUpdated', {
          type,
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectUpdated', {
          type,
          value: value ?? '',
        })
      );
    }
  }

  /**
   * Update application page permissions, by sending a mutation to the back-end.
   *
   * @param page Edited page
   * @param permissions new permissions
   * @param callback callback method, allow the component calling the service to do some logic.
   */
  updatePagePermissions(page: Page, permissions: any, callback?: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: page.id,
            permissions,
          },
        })
        .subscribe(({ errors, data }) => {
          this.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.page.one')
          );
          if (!errors && data) {
            const newApplication = {
              ...application,
              pages: application.pages?.map((x) => {
                if (x.id === page.id) {
                  x = {
                    ...x,
                    canSee: data.editPage.permissions.canSee,
                    canDelete: data.editPage.permissions.canDelete,
                    canUpdate: data.editPage.permissions.canUpdate,
                  };
                }
                return x;
              }),
            };
            this.application.next(newApplication);
            if (callback) callback(data.editPage.permissions);
          }
        });
    }
  }
}
