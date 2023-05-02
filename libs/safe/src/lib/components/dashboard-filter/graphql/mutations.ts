import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';

/** Graphql request for editing an application by its id */
export const EDIT_APPLICATION_FILTER = gql`
  mutation editApplication($id: ID!, $contextualFilter: JSON) {
    editApplication(id: $id, contextualFilter: $contextualFilter) {
      id
      description
      name
      createdAt
      modifiedAt
      status
      contextualFilter
    }
  }
`;

/** Edit application gql mutation response interface */
export interface EditApplicationMutationResponse {
  editApplication: Application;
}
