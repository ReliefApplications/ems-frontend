import { Apollo } from 'apollo-angular';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User, Role } from '../models/user.model';
import { Page, ContentType } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { SafeSnackBarService } from './snackbar.service';
import {
  AddPageMutationResponse,
  ADD_PAGE,
  AddRoleMutationResponse,
  ADD_ROLE,
  AddRoleToUsersMutationResponse,
  ADD_ROLE_TO_USERS,
  DeletePageMutationResponse,
  DELETE_PAGE,
  DeleteRoleMutationResponse,
  DELETE_ROLE,
  EditApplicationMutationResponse,
  EDIT_APPLICATION,
  EditUserMutationResponse,
  EDIT_USER,
  EditRoleMutationResponse,
  EDIT_ROLE,
  AddChannelMutationResponse,
  ADD_CHANNEL,
  DeleteChannelMutationResponse,
  DELETE_CHANNEL,
  AddSubscriptionMutationResponse,
  ADD_SUBSCRIPTION,
  EditSubscriptionMutationResponse,
  EDIT_SUBSCRIPTION,
  DeleteSubscriptionMutationResponse,
  DELETE_SUBSCRIPTION,
  AddPositionAttributeCategoryMutationResponse,
  ADD_POSITION_ATTRIBUTE_CATEGORY,
  DeleteUsersFromApplicationMutationResponse,
  DELETE_USERS_FROM_APPLICATION,
  DeletePositionAttributeCategoryMutationResponse,
  DELETE_POSITION_ATTRIBUTE_CATEGORY,
  EditPositionAttributeCategoryMutationResponse,
  EDIT_POSITION_ATTRIBUTE_CATEGORY,
  EditChannelMutationResponse,
  EDIT_CHANNEL,
  ToggleApplicationLockMutationResponse,
  TOGGLE_APPLICATION_LOCK,
  duplicatePageMutationResponse,
  DUPLICATE_PAGE,
  EditDashboardMutationResponse,
  EDIT_DASHBOARD,
} from '../graphql/mutations';
import {
  GetApplicationByIdQueryResponse,
  GetDashboardByIdQueryResponse,
  GET_APPLICATION_BY_ID,
  GET_DASHBOARD_BY_ID,
} from '../graphql/queries';
import { PositionAttributeCategory } from '../models/position-attribute-category.model';
import {
  ApplicationEditedSubscriptionResponse,
  ApplicationUnlockedSubscriptionResponse,
  APPLICATION_EDITED_SUBSCRIPTION,
  APPLICATION_UNLOCKED_SUBSCRIPTION,
} from '../graphql/subscriptions';
import { SafeAuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Shared application service. Handles events of opened application.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeApplicationService {
  /** Current application */
  private application = new BehaviorSubject<Application | null>(null);
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

  /**
   * Shared application service. Handles events of opened application.
   *
   * @param environment Current environment
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param router Angular router
   * @param translate Service used to get translations
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private router: Router,
    private translate: TranslateService
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
    this.applicationSubscription = this.apollo
      .query<GetApplicationByIdQueryResponse>({
        query: GET_APPLICATION_BY_ID,
        variables: {
          id,
          asRole,
        },
      })
      .subscribe((res) => {
        this.application.next(res.data.application);
        const application = this.application.getValue();
        if (res.data.application.locked) {
          if (!application?.lockedByUser) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectLocked', {
                name: res.data.application.name,
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
        snackBar.onAction().subscribe(() => window.location.reload());
      });
    this.lockSubscription = this.apollo
      .subscribe<ApplicationUnlockedSubscriptionResponse>({
        query: APPLICATION_UNLOCKED_SUBSCRIPTION,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        if (res.data?.applicationUnlocked) {
          const application = this.application.getValue();
          const newApplication = {
            ...application,
            locked: res.data?.applicationUnlocked.locked,
            lockedByUser: res.data?.applicationUnlocked.lockedByUser,
          };
          this.application.next(newApplication);
        }
      });
  }

  /**
   * Leaves application and unsubscribe to application changes.
   */
  leaveApplication(): void {
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
   * Locks application edition.
   */
  lockApplication(): void {
    const application = this.application.getValue();
    this.apollo
      .mutate<ToggleApplicationLockMutationResponse>({
        mutation: TOGGLE_APPLICATION_LOCK,
        variables: {
          id: application?.id,
          lock: true,
        },
      })
      .subscribe((res) => {
        if (res.data?.toggleApplicationLock) {
          if (!res.data.toggleApplicationLock.lockedByUser) {
            const newApplication = {
              ...application,
              locked: res.data?.toggleApplicationLock.locked,
              lockedByUser: res.data?.toggleApplicationLock.lockedByUser,
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
            status: value.status,
          },
        })
        .subscribe((res) => {
          if (res.errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.application.one'),
                error: res.errors[0].message,
              })
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate
                  .instant('common.application.one')
                  .toLowerCase(),
                value: value.name,
              })
            );
            if (res.data?.editApplication) {
              const newApplication = {
                ...application,
                name: res.data.editApplication.name,
                description: res.data.editApplication.description,
                status: res.data.editApplication.status,
              };
              this.application.next(newApplication);
            }
          }
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'models.application.notifications.published',
                {
                  value: res.data.editApplication.name,
                }
              )
            );
            this.router.navigate(['/applications']);
          }
        });
    }
  }

  /**
   * Deletes a page and the associated content.
   *
   * @param id id of the page
   */
  deletePage(id: string): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<DeletePageMutationResponse>({
          mutation: DELETE_PAGE,
          variables: {
            id,
          },
        })
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: this.translate.instant('common.page.one'),
              })
            );
            const app = this.application.getValue();
            if (app) {
              const newApplication = {
                ...app,
                pages: app.pages?.filter(
                  (x) => x.id !== res.data?.deletePage.id
                ),
              };
              this.application.next(newApplication);
              this.router.navigate([`./applications/${app.id}`]);
            }
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotDeleted', {
                value: this.translate.instant('common.page.one').toLowerCase(),
                error: res.errors ? res.errors[0].message : '',
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
        .subscribe((res) => {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectReordered', {
              type: this.translate.instant('common.page.few').toLowerCase(),
            })
          );
          this.application.next({
            ...application,
            ...{ pages: res.data?.editApplication.pages },
          });
        });
    }
  }

  /**
   * Updates a specific page name in the opened application.
   *
   * @param page updated page
   */
  updatePageName(page: Page): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
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
    }
  }

  /**
   * Adds a new page to the opened application.
   *
   * @param page new page
   */
  addPage(page: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddPageMutationResponse>({
          mutation: ADD_PAGE,
          variables: {
            type: page.type,
            content: page.content,
            application: application.id,
          },
        })
        .subscribe((res) => {
          if (res.data?.addPage) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectCreated', {
                type: this.translate.instant('common.page.one').toLowerCase(),
                value: res.data.addPage.name,
              })
            );
            const content = res.data.addPage.content;
            const newApplication = {
              ...application,
              pages: application.pages?.concat([res.data.addPage]),
            };
            this.application.next(newApplication);
            this.router.navigate([
              page.type === ContentType.form
                ? `/applications/${application.id}/${page.type}/${res.data.addPage.id}`
                : `/applications/${application.id}/${page.type}/${content}`,
            ]);
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotCreated', {
                type: this.translate.instant('common.page.one').toLowerCase(),
                error: res.errors ? res.errors[0].message : '',
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
   * @param pageId page id which will be duplicated
   * @param applicationId id of the application where it shoul be duplicated
   */
  duplicatePage(pageId: string, applicationId: string): void {
    this.apollo
      .mutate<duplicatePageMutationResponse>({
        mutation: DUPLICATE_PAGE,
        variables: {
          id: pageId,
          application: applicationId,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotCreated', {
              type: this.translate.instant('common.page.one').toLowerCase(),
              error: res.errors ? res.errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          if (res.data?.duplicatePage) {
            const newPage = res.data.duplicatePage;
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
          }
        }
      });
  }

  /**
   * Duplicates widget in indicated dashboard of an application.
   *
   * @param widget widget which will be duplicated
   * @param dashboardId dashboard where the widget will be duplicated
   */
  duplicateWidget(widget: any, dashboardId: string): void {
    this.snackBar.openSnackBar(
      this.translate.instant('models.widget.duplicate'),
      { duration: 2500 }
    );
    this.apollo
      .query<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: dashboardId,
        },
      })
      .subscribe((res: any) => {
        if (res.data.dashboard) {
          let tiles = res.data.dashboard.structure
            ? [...res.data.dashboard.structure]
            : [];
          const generatedTiles =
            tiles.length === 0 ? 0 : Math.max(...tiles.map((x) => x.id)) + 1;
          widget.id = generatedTiles;
          tiles = [...tiles, widget];
          this.apollo
            .mutate<EditDashboardMutationResponse>({
              mutation: EDIT_DASHBOARD,
              variables: {
                id: dashboardId,
                structure: tiles,
              },
            })
            .subscribe((res2) => {
              if (res2.data?.editDashboard) {
                const applicationId =
                  res2.data.editDashboard.page?.application?.id;
                this.router.navigate([
                  `/applications/${applicationId}/dashboard/${dashboardId}`,
                ]);
              }
            });
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.accessNotProvided', {
              type: this.translate
                .instant('common.dashboard.one')
                .toLowerCase(),
              error: '',
            }),
            { error: true }
          );
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectCreated', {
                type: this.translate.instant('common.role.one').toLowerCase(),
                value: role.title,
              })
            );
            const newApplication = {
              ...application,
              roles: application.roles?.concat([res.data.addRole]),
            };
            this.application.next(newApplication);
          }
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.role.one').toLowerCase(),
                value: role.title,
              })
            );
            const newApplication: Application = {
              ...application,
              roles: application.roles?.map((x) => {
                if (x.id === role.id) {
                  x = {
                    ...x,
                    permissions: res.data?.editRole.permissions,
                    channels: res.data?.editRole.channels,
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
        .subscribe((res) => {
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
        .subscribe((res) => {
          if (res.data) {
            const deletedUsers = res.data.deleteUsersFromApplication.map(
              (x) => x.id
            );
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: this.translate
                  .instant(
                    deletedUsers.length > 1
                      ? 'common.user.few'
                      : 'common.user.one'
                  )
                  .toLowerCase(),
              })
            );
            const newApplication = {
              ...application,
              users: application.users?.filter(
                (u) => !deletedUsers.includes(u.id)
              ),
            };
            this.application.next(newApplication);
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotDeleted', {
                value: this.translate
                  .instant(
                    ids.length > 1 ? 'common.user.few' : 'common.user.one'
                  )
                  .toLowerCase(),
                error: '',
              }),
              { error: true }
            );
          }
          resolved();
        });
    }
  }

  /**
   * Invites an user to the application.
   *
   * @param user new user
   */
  inviteUser(user: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<AddRoleToUsersMutationResponse>({
          mutation: ADD_ROLE_TO_USERS,
          variables: {
            usernames: user.email,
            role: user.role,
            ...(user.positionAttributes && {
              positionAttributes: user.positionAttributes.filter(
                (x: any) => x.value
              ),
            }),
          },
        })
        .subscribe((res: any) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectInvited', {
                name: this.translate
                  .instant(
                    res.data?.addUsers.length
                      ? 'common.user.few'
                      : 'common.user.one'
                  )
                  .toLowerCase(),
              })
            );
            const newApplication = {
              ...application,
              users: application.users?.concat(res.data.addRoleToUsers),
            };
            this.application.next(newApplication);
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotInvited', {
                name: this.translate
                  .instant(
                    res.data?.addUsers.length
                      ? 'common.user.few'
                      : 'common.user.one'
                  )
                  .toLowerCase(),
              }),
              { error: true }
            );
          }
        });
    }
  }

  /**
   * Edits an user that has access to the application.
   *
   * @param user user to edit
   * @param value new value
   */
  editUser(user: User, value: any): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<EditUserMutationResponse>({
          mutation: EDIT_USER,
          variables: {
            id: user.id,
            roles: value.roles,
            application: application.id,
            ...(value.positionAttributes && {
              positionAttributes: value.positionAttributes,
            }),
          },
        })
        .subscribe((res) => {
          if (res.data) {
            const newUser = res.data.editUser;
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.role.few').toLowerCase(),
                value: user.username,
              })
            );
            const index = application?.users?.indexOf(user);
            if (application?.users && index) {
              const newApplication: Application = {
                ...application,
                users:
                  application.users?.map((x) =>
                    String(x.id) === String(user.id) ? newUser || null : x
                  ) || [],
              };
              this.application.next(newApplication);
            }
            this.authService.getProfile();
          }
        });
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
        .subscribe((res) => {
          if (res.data) {
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
                  res.data.addPositionAttributeCategory,
                ]),
            };
            this.application.next(newApplication);
          }
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: category.title,
              })
            );
            const newApplication: Application = {
              ...application,
              positionAttributeCategories:
                application.positionAttributeCategories?.filter(
                  (x) => x.id !== res.data?.deletePositionAttributeCategory.id
                ),
            };
            this.application.next(newApplication);
          }
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
        .subscribe((res) => {
          if (res.errors) {
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
                      title: res.data?.editPositionAttributeCategory.title,
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
        .subscribe((res) => {
          if (res.data) {
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
              channels: application.channels?.concat([res.data.addChannel]),
            };
            this.application.next(newApplication);
          }
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
      .subscribe((res) => {
        if (res.data) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectUpdated', {
              type: this.translate.instant('common.channel.one'),
              value: title,
            })
          );
          const newApplication: Application = {
            ...application,
            channels: application?.channels?.map((x) => {
              if (x.id === channel.id) {
                x = { ...x, title: res.data?.editChannel.title };
              }
              return x;
            }),
          };
          this.application.next(newApplication);
        }
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: channel.title,
              })
            );
            const newApplication: Application = {
              ...application,
              channels: application.channels?.filter(
                (x) => x.id !== res.data?.deleteChannel.id
              ),
            };
            this.application.next(newApplication);
          }
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
        .subscribe((res) => {
          if (res.data) {
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
                res.data.addSubscription,
              ]),
            };
            this.application.next(newApplication);
          }
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
        .subscribe((res) => {
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
        .subscribe((res) => {
          if (res.data) {
            const subscription = res.data.editSubscription;
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate
                  .instant('common.subscription.one')
                  .toLowerCase(),
                value: value.title,
              })
            );
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
}
