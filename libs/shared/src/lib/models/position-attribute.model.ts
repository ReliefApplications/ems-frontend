import { PositionAttributeCategory } from './position-attribute-category.model';

/** Model for PositionAttribute object */
export interface PositionAttribute {
  value?: string;
  category?: PositionAttributeCategory;
  usersCount?: number;
}

/** Model for add position attribute category mutation response */
export interface AddPositionAttributeCategoryMutationResponse {
  addPositionAttributeCategory: PositionAttributeCategory;
}
/** Model for edit position attribute category mutation response */
export interface EditPositionAttributeCategoryMutationResponse {
  editPositionAttributeCategory: PositionAttributeCategory;
}
/** Model for delete position attribute category mutation response */
export interface DeletePositionAttributeCategoryMutationResponse {
  deletePositionAttributeCategory: PositionAttributeCategory;
}

/** Model for position attributes from category graphql query response */
export interface PositionAttributesQueryResponse {
  positionAttributes: PositionAttribute[];
}
