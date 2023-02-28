import { gql } from 'apollo-angular';
import { Form } from '@oort-front/safe';

// === GET FORM BY ID ===
/** Graphql query for getting a form with minimum details by id */
export const GET_SHORT_FORM_BY_ID = gql`
  query GetShortFormById($id: ID!) {
    form(id: $id) {
      id
      name
      core
      structure
      fields
      status
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
      }
      metadata {
        name
        automated
        canSee
        canUpdate
      }
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      canUpdate
      resource {
        name
      }
    }
  }
`;

/** Model for getFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  form: Form;
}
