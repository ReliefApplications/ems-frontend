import { Page } from './page.model';
import { Channel } from './channel.model';
import { Role, User } from './user.model';
import { Subscription } from './subscription.model';
import { PositionAttributeCategory } from './position-attribute-category.model';
import { status } from './form.model';

/** Model for Application object. */
export interface Application {
  id?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  pages?: Page[];
  roles?: Role[];
  users?: User[];
  status?: status;
  usersCount?: number;
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
}
