import { gql } from 'apollo-angular';
import { Form } from '../../../../../models/form.model';
import { Resource } from '../../../../../models/resource.model';

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      forms {
        id
        name
      }
      layouts {
        id
        name
        query
        createdAt
        display
      }
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

/** Graphql request for getting the meta fields of a grid by form id */
export const GET_FORM = gql`
  query GetForm($id: ID!) {
    form(id: $id) {
      id
      name
      queryName
      layouts {
        id
        name
        createdAt
        query
        display
      }
    }
  }
`;

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}
