import { Page } from './page.model';
import { Channel } from './channel.model';
import { Role, User, UserConnection } from './user.model';
import { Subscription } from './subscription.model';
import { PositionAttributeCategory } from './position-attribute-category.model';
import { status } from './form.model';
import { Template } from './template.model';
import { DistributionList } from './distribution-list.model';

/** Model for Application object. */
export interface Application {
  id?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  pages?: Page[];
  roles?: Role[];
  users?: UserConnection;
  userRoles?: Role[];
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
}
