import { gql } from 'apollo-angular';

// === GET STEP BY ID ===

/** Graphql query for getting a step by its id */
export const GET_STEP_BY_ID = gql`
  query GetStepById($id: ID!) {
    step(id: $id) {
      id
      name
      createdAt
      modifiedAt
      content
      workflow {
        id
        name
        page {
          id
          application {
            shortcut
            id
          }
        }
      }
      buttons
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

// === GET PAGE BY ID ===

/** Graphql query for getting a page data by its id */
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!) {
    page(id: $id) {
      id
      name
      createdAt
      modifiedAt
      type
      content
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
      buttons
      application {
        shortcut
        id
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;

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
      metadata {
        name
        automated
        canSee
        canUpdate
      }
    }
  }
`;
