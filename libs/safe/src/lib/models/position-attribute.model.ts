import { PositionAttributeCategory } from './position-attribute-category.model';

/** Model for PositionAttribute object */
export interface PositionAttribute {
  value?: string;
  category?: PositionAttributeCategory;
  usersCount?: number;
}
