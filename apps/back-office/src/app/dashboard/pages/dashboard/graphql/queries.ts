import { gql } from 'apollo-angular';

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!, $contextEl: JSON) {
    dashboard(id: $id, contextEl: $contextEl) {
      id
      name
      nameTranslations
      createdAt
      contextData
      structure
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
      canSee
      canUpdate
      page {
        id
        icon
        showName
        navBar {
          showName
          showIcon
        }
        visible
        application {
          id
          shortcut
        }
        canUpdate
        context
        content
        contentWithContext
      }
      step {
        id
        icon
        showName
        navBar {
          showName
          showIcon
        }
        workflow {
          id
          name
          page {
            id
            application {
              id
              shortcut
            }
          }
        }
        canUpdate
      }
      filter
      gridOptions
      defaultTemplate
    }
  }
`;

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
export const GET_DASHBOARDS_NAMES = gql`
  query GetDashboardsById($ids: [ID]!) {
    dashboards(ids: $ids) {
      id
      name
      nameTranslations
    }
  }
`;

/** Graphql query for getting the query name of a resource */
export const GET_RESOURCE_QUERY_NAME = gql`
  query GetResourceQueryName($id: ID!) {
    resource(id: $id) {
      id
      queryName
    }
  }
`;
