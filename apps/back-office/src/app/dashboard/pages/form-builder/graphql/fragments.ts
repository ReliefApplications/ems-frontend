import { gql } from 'apollo-angular';

/** Edit form fields gql fragment */
export const EDIT_FORM_FIELDS = gql`
  fragment EditFormFields on Form {
    id
    name
    createdAt
    status
    core
    fields
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
  }
`;
