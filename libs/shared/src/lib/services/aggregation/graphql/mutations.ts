import { gql } from 'apollo-angular';

/** Graphql request for adding a new aggregation with a given type */
export const ADD_AGGREGATION = gql`
  mutation addAggregation(
    $resource: ID
    $referenceData: ID
    $aggregation: AggregationInputType!
  ) {
    addAggregation(
      resource: $resource
      referenceData: $referenceData
      aggregation: $aggregation
    ) {
      id
      name
      sourceFields
      pipeline
      createdAt
    }
  }
`;

/** GraphQL request for editing a layout by its id */
export const EDIT_AGGREGATION = gql`
  mutation editAggregation(
    $resource: ID
    $referenceData: ID
    $aggregation: AggregationInputType!
    $id: ID!
  ) {
    editAggregation(
      resource: $resource
      referenceData: $referenceData
      aggregation: $aggregation
      id: $id
    ) {
      id
      name
      sourceFields
      pipeline
      createdAt
    }
  }
`;

/** Graphql request for deleting a aggregation by its id */
export const DELETE_AGGREGATION = gql`
  mutation deleteAggregation($resource: ID, $id: ID!) {
    deleteAggregation(resource: $resource, id: $id) {
      id
      name
      sourceFields
      pipeline
      createdAt
    }
  }
`;
