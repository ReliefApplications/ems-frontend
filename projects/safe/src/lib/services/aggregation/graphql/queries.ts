import { gql } from 'apollo-angular';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';

// === GET RELATED FORMS FROM RESOURCE ===
/** Graphql request for getting resource meta date for a grid */
export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta($resource: ID!) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
      }
      aggregations {
        id
        name
        dataSource
        sourceFields
        pipeline
        mapping
        createdAt
      }
    }
  }
`;

// === GET RESOURCE BY ID ===
/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

// === GET FORM BY ID ===
/** Graphql request for getting the meta fields of a grid by form id */
export const GET_GRID_FORM_META = gql`
  query GetFormAsTemplate($id: ID!) {
    form(id: $id) {
      id
      name
      queryName
      aggregations {
        id
        name
        dataSource
        sourceFields
        pipeline
        mapping
        createdAt
      }
    }
  }
`;

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}
