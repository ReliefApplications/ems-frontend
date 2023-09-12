import { gql } from 'apollo-angular';
import { RESOURCE_FIELDS, SHORT_RESOURCE_FIELDS } from './fragments';

/** Get role by id GraphQL query */
export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      id
      title
      description
      channels {
        id
        title
      }
      permissions {
        id
        type
      }
      application {
        id
      }
      autoAssignment
    }
  }
`;

/** Graphql request for getting permissions */
export const GET_PERMISSIONS = gql`
  query GetPermissions($application: Boolean) {
    permissions(application: $application) {
      id
      type
      global
    }
  }
`;

/** Graphql request for getting channels (optionnally by an application id) */
export const GET_CHANNELS = gql`
  query getChannels($application: ID) {
    channels(application: $application) {
      id
      title
      application {
        id
        name
      }
    }
  }
`;

/** Graphql request for getting the features of an application by its id */
export const GET_APPLICATION_FEATURES = gql`
  query getApplicationFeatures($id: ID!) {
    application(id: $id) {
      id
      pages {
        id
        name
        type
        content
        permissions {
          canSee {
            id
          }
        }
      }
    }
  }
`;

/** Graphql request for getting the steps of a workflow by its id */
export const GET_WORKFLOW_STEPS = gql`
  query getWorkflowSteps($id: ID!) {
    workflow(id: $id) {
      id
      steps {
        id
        name
        type
        content
        permissions {
          canSee {
            id
          }
        }
      }
    }
  }
`;

/** Graphql query for getting resources with a filter and more data */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
    $role: ID!
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          ...ShortResourceFields
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
  ${SHORT_RESOURCE_FIELDS}
`;

/** GraphQL query to get a single resource */
export const GET_RESOURCE = gql`
  query GetResources($id: ID!, $role: ID!) {
    resource(id: $id) {
      forms {
        id
        name
      }
      ...ResourceFields
    }
  }
  ${RESOURCE_FIELDS}
`;

/** Graphql request for getting groups */
export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      title
    }
  }
`;
