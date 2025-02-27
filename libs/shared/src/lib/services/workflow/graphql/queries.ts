import { gql } from 'apollo-angular';

// === GET WORKFLOW BY ID ===

/** Graphql request for getting workflow by its id */
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!, $asRole: ID) {
    workflow(id: $id, asRole: $asRole) {
      id
      name
      createdAt
      modifiedAt
      canUpdate
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
      steps {
        id
        icon
        showName
        name
        type
        content
        createdAt
        canDelete
      }
      page {
        id
        icon
        showName
        name
        visible
        canUpdate
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
        application {
          id
          shortcut
        }
      }
    }
  }
`;
