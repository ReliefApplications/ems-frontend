import { gql } from 'apollo-angular';
import { Form } from '../../../../models/form.model';

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
