import { PositionAttributeCategory } from './position-attribute-category.model';

export interface PositionAttribute {
  value?: string;
  category?: PositionAttributeCategory;
  usersCount?: number;
}
