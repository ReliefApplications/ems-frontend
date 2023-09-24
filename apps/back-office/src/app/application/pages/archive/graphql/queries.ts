import { gql } from 'apollo-angular';

// === GET APPLICATION BY ID ===
/** Graphql request for getting application data by its id */
export const GET_APPLICATION_ARCHIVED_PAGES = gql`
  query GetApplicationById($id: ID!, $asRole: ID) {
    application(id: $id, asRole: $asRole) {
      id
      pages(archived: true) {
        id
        name
        type
        autoDeletedAt
        canSee
        canUpdate
        canDelete
      }
    }
  }
`;
