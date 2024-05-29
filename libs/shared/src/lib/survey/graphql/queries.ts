import { gql } from 'apollo-angular';

// === GET ROLES FROM APPLICATION ===

/** Graphql request for getting roles of applications by the application ids */
export const GET_ROLES_FROM_APPLICATIONS = gql`
  query GetRolesFromApplications($applications: [ID]!) {
    rolesFromApplications(applications: $applications) {
      id
      title(appendApplicationName: true)
    }
  }
`;

// === GET RESOURCE BY ID ===
/** Graphql request for getting data of a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!, $filter: JSON, $display: Boolean) {
    resource(id: $id) {
      id
      name
      createdAt
      records(filter: $filter) {
        edges {
          node {
            id
            data(display: $display)
          }
          cursor
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/** Get short resource graphql query definition */
export const GET_SHORT_RESOURCE_BY_ID = gql`
  query GetShortResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      createdAt
      fields
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
      }
    }
  }
`;
