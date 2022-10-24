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
  MANAGE_TEMPLATE,
  ManageTemplateMutationResponse,
} from '../graphql/mutations';
import {
  GetApplicationByIdQueryResponse,
  GET_APPLICATION_BY_ID,
} from '../graphql/queries';
import { PositionAttributeCategory } from '../models/position-attribute-category.model';
import { NOTIFICATIONS } from '../const/notifications';
import {
  ApplicationEditedSubscriptionResponse,
  ApplicationUnlockedSubscriptionResponse,
  APPLICATION_EDITED_SUBSCRIPTION,
  APPLICATION_UNLOCKED_SUBSCRIPTION,
} from '../graphql/subscriptions';
import { SafeAuthService } from './auth.service';

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
          NOTIFICATIONS.objectIsLocked(application.name)
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
  get templates(): any[] {
    return this.application.value?.templates || [];
  }

  /**
   * Shared application service. Handles events of opened application.
   *
   * @param environment Current environment
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param router Angular router
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private router: Router
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
              NOTIFICATIONS.objectIsLocked(res.data.application.name)
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
        const snackBar = this.snackBar.openSnackBar(NOTIFICATIONS.appEdited, {
          action: 'Reload',
          duration: 0,
        });
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
              NOTIFICATIONS.objectNotUpdated(
                'Application',
                res.errors[0].message
              )
            );
          } else {
            this.snackBar.openSnackBar(
              NOTIFICATIONS.objectEdited('application', value.name)
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
              NOTIFICATIONS.appPublished(res.data.editApplication.name)
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
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Page'));
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
              NOTIFICATIONS.objectNotDeleted(
                'page',
                res.errors ? res.errors[0].message : ''
              ),
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
          this.snackBar.openSnackBar(NOTIFICATIONS.objectReordered('Pages'));
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
              NOTIFICATIONS.objectCreated('page', res.data.addPage.name)
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
              NOTIFICATIONS.objectNotCreated(
                'page',
                res.errors ? res.errors[0].message : ''
              ),
              { error: true }
            );
          }
        });
    }
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
              NOTIFICATIONS.objectCreated(role.title, 'role')
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
              NOTIFICATIONS.objectEdited('role', role.title)
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
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted(role.title));
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
              NOTIFICATIONS.usersActions('deleted', deletedUsers.length)
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
              NOTIFICATIONS.userInvalidActions('deleted'),
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
              NOTIFICATIONS.usersActions(
                'invited',
                res.data.addRoleToUsers.length
              )
            );
            const newApplication = {
              ...application,
              users: application.users?.concat(res.data.addRoleToUsers),
            };
            this.application.next(newApplication);
          } else {
            this.snackBar.openSnackBar(
              NOTIFICATIONS.userInvalidActions('invited'),
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
              NOTIFICATIONS.objectEdited('roles', user.username)
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
              NOTIFICATIONS.objectCreated(category.title, 'position category')
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
              NOTIFICATIONS.objectDeleted(category.title)
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
              NOTIFICATIONS.objectAlreadyExists(
                'position category',
                value.title
              ),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              NOTIFICATIONS.objectEdited('position category', value.title)
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
              NOTIFICATIONS.objectCreated('channel', channel.title)
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
            NOTIFICATIONS.objectEdited('Channel', title)
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
              NOTIFICATIONS.objectDeleted(channel.title)
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
              NOTIFICATIONS.objectCreated('subscription', subscription.title)
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
            NOTIFICATIONS.objectDeleted('Subscription')
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
              NOTIFICATIONS.objectEdited('subscription', value.title)
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

  /**
   * Adds a new email template to the application.
   *
   * @param template new email template
   * @param template.name name for the template
   * @param template.subject email template subject
   * @param template.body email template body
   */
  addEmailTemplate(template: {
    name: string;
    subject: string;
    body: string;
  }): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<ManageTemplateMutationResponse>({
          mutation: MANAGE_TEMPLATE,
          variables: {
            application: application.id,
            templateChanges: {
              add: {
                name: template.name,
                type: 'email',
                content: {
                  subject: template.subject,
                  body: template.body,
                },
              },
            },
          },
        })
        .subscribe((res) => {
          if (res.data) {
            const newApplication: Application = {
              ...application,
              templates: res.data.editApplication.templates,
            };

            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Removes a template by its id.
   *
   * @param template template's id to be deleted
   */
  deleteTemplate(template: string): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<ManageTemplateMutationResponse>({
          mutation: MANAGE_TEMPLATE,
          variables: {
            application: application.id,
            templateChanges: {
              remove: {
                id: template,
              },
            },
          },
        })
        .subscribe((res) => {
          if (res.data) {
            const newApplication: Application = {
              ...application,
              templates: res.data.editApplication.templates,
            };
            console.log('removed', newApplication);
            this.application.next(newApplication);
          }
        });
    }
  }

  /**
   * Edits existing template.
   *
   * @param id id of template to be edited
   * @param updatedData new data for the template
   * @param updatedData.name new name for the template
   * @param updatedData.subject new subject for the template
   * @param updatedData.body new body for the template
   */
  editEmailTemplate(
    id: string,
    updatedData: {
      name: string;
      subject: string;
      body: string;
    }
  ): void {
    const application = this.application.getValue();
    if (application && this.isUnlocked) {
      this.apollo
        .mutate<ManageTemplateMutationResponse>({
          mutation: MANAGE_TEMPLATE,
          variables: {
            application: application.id,
            templateChanges: {
              update: {
                id,
                name: updatedData.name,
                content: {
                  subject: updatedData.subject,
                  body: updatedData.body,
                },
              },
            },
          },
        })
        .subscribe((res) => {
          if (res.data) {
            const newApplication: Application = {
              ...application,
              templates: res.data.editApplication.templates,
            };
            this.application.next(newApplication);
          }
        });
    }
  }
}
