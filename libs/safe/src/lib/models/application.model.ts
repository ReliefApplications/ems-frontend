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

/** Model for Application object. */
export interface Application {
  id?: string;
  name?: string;
  description?: string;
  sideMenu?: boolean;
  showLeftSideBar?: boolean;
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
  contextualFilter?: any;
  contextualFilterPosition?: any;
}
