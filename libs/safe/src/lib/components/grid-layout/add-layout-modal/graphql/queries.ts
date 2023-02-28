import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { Form } from '../../../../models/form.model';

// === FETCH LAYOUTS ===

/** Graphql request for getting resource layouts by its id */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResourceLayouts($resource: ID!, $first: Int, $afterCursor: ID) {
    resource(id: $resource) {
      layouts(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/** Model for GetResourceLayoutsResponse object */
export interface GetResourceLayoutsResponse {
  resource: Resource;
}

/** Graphql request for getting form layouts by its id */
export const GET_FORM_LAYOUTS = gql`
  query GetFormLayouts($form: ID!, $first: Int, $afterCursor: ID) {
    form(id: $form) {
      layouts(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/** Model for GetFormLayoutsResponse object */
export interface GetFormLayoutsResponse {
  form: Form;
}
