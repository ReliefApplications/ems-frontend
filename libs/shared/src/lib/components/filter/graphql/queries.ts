import { gql } from 'apollo-angular';

/** Graphql query for getting a form with minimum details by id */
export const GET_FIELD_DETAILS = gql`
  query getFieldsDetails($resource: ID!, $field: JSON!) {
    fieldDetails(resource: $resource, field: $field)
  }
`;
