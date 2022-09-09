import { gql } from 'apollo-angular';
import { Aggregation } from '../../../models/aggregation.model';

/** Graphql request for adding a new aggregation with a given type */
export const ADD_AGGREGATION = gql`
  mutation addAggregation(
    $resource: ID
    $form: ID
    $aggregation: AggregationInputType!
  ) {
    addAggregation(
      resource: $resource
      form: $form
      aggregation: $aggregation
    ) {
      id
      name
      createdAt
      query
      display
    }
  }
`;

/** Model for AddAggregationMutationResponse object */
export interface AddAggregationMutationResponse {
  loading: boolean;
  addAggregation: Aggregation;
}

/** GraphQL request for editing a layout by its id */
export const EDIT_AGGREGATION = gql`
  mutation editAggregation(
    $resource: ID
    $form: ID
    $aggregation: AggregationInputType!
    $id: ID!
  ) {
    editAggregation(
      resource: $resource
      form: $form
      aggregation: $aggregation
      id: $id
    ) {
      id
      name
      createdAt
      query
      display
    }
  }
`;

/** Model for EditAggregationMutationResponse object */
export interface EditAggregationMutationResponse {
  loading: boolean;
  editAggregation: Aggregation;
}

/** Graphql request for deleting a aggregation by its id */
export const DELETE_AGGREGATION = gql`
  mutation deleteAggregation($resource: ID, $form: ID, $id: ID!) {
    deleteAggregation(resource: $resource, form: $form, id: $id) {
      id
      name
      createdAt
    }
  }
`;

/** Model for deleteAggregationMutationResponse object */
export interface deleteAggregationMutationResponse {
  loading: boolean;
  deleteAggregation: Aggregation;
}
