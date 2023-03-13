import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Application } from './application.model';
import { Channel } from './channel.model';
import { PositionAttribute } from './position-attribute.model';

/** Model for Permission object. */
export interface Permission {
  id?: string;
  type?: string;
  global?: boolean;
}

/** Model for Role object. */
export interface Role {
  id?: string;
  title?: string;
  description?: string;
  usersCount?: number;
  permissions?: Permission[];
  application?: Application;
  channels?: Channel[];
  autoAssignment?: CompositeFilterDescriptor[];
}

/** Model for Group object. */
export interface Group {
  id?: string;
  title?: string;
  description?: string;
  usersCount?: number;
}

/** Model for User object. */
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  isAdmin?: boolean;
  name?: string;
  roles?: Role[];
  groups?: Group[];
  permissions?: Permission[];
  oid?: string;
  applications?: Application[];
  positionAttributes?: PositionAttribute[];
  favoriteApp?: string;
}
