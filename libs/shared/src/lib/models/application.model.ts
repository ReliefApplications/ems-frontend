import { Page } from './page.model';
import { Channel } from './channel.model';
import { Role, User } from './user.model';
import { Subscription } from './subscription.model';
import { PositionAttributeCategory } from './position-attribute-category.model';
import { status } from './form.model';
import { Template } from './template.model';
import { DistributionList } from './distribution-list.model';
import { Connection } from '../utils/graphql/connection.type';
import { CustomNotification } from './custom-notification.model';
import { GraphqlNodesResponse } from './graphql-query.model';

/** Model for Application object. */
export interface Application {
  id?: string;
  name?: string;
  description?: string;
  sideMenu?: boolean;
  hideMenu?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
  pages?: Page[];
  roles?: Role[];
  userRoles?: Role[];
  users?: Connection<User>;
  status?: status;
  settings?: any;
  permissions?: any;
  channels?: Channel[];
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  subscriptions?: Subscription[];
  positionAttributeCategories?: PositionAttributeCategory[];
  locked?: boolean;
  lockedBy?: User;
  lockedByUser?: boolean;
  templates?: Template[];
  distributionLists?: DistributionList[];
  customNotifications?: Connection<CustomNotification>;
  publicCssFilename?: string;
}

/** Model for application query response object */
export interface ApplicationQueryResponse {
  application: Application;
}

/** Model for add application graphql mutation response */
export interface AddApplicationMutationResponse {
  addApplication: Application;
}

/** Model for edit application graphql mutation response */
export interface EditApplicationMutationResponse {
  editApplication: Application;
}

/** Model for delete application graphql mutation response */
export interface DeleteApplicationMutationResponse {
  deleteApplication: Application;
}

/** Model for applications application nodes graphql query response*/
export interface ApplicationsApplicationNodesQueryResponse {
  applications: GraphqlNodesResponse<Application>;
}

/** Duplicate application graphql mutation response */
export interface DuplicateApplicationMutationResponse {
  duplicateApplication: Application;
}

/** Model for application custom notifications nodes graphql query response*/
export interface ApplicationCustomNotificationsNodesQueryResponse {
  application: {
    customNotifications: GraphqlNodesResponse<CustomNotification>;
  };
}

/** Model for toggle application lock mutation response */
export interface ToggleApplicationLockMutationResponse {
  toggleApplicationLock: Application;
}

/** Model for application unlock subscription response */
export interface ApplicationUnlockedSubscriptionResponse {
  applicationUnlocked: Application;
}

/** Model for application edit subscription response */
export interface ApplicationEditedSubscriptionResponse {
  applicationEdited: Application;
}
