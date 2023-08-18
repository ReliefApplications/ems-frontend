import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';
import { Resource } from '../../../models/resource.model';
import { Channel } from '../../../models/channel.model';
import { Group, Permission, Role } from '../../../models/user.model';
import { Workflow } from '../../../models/workflow.model';
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

/** Interface of Get role query */
export interface GetRoleQueryResponse {
  role: Role;
}

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

/** Model for GetPermissionsQueryResponse object */
export interface GetPermissionsQueryResponse {
  permissions: Permission[];
}

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

/** Model for GetChannelsQueryResponse object */
export interface GetChannelsQueryResponse {
  channels: Channel[];
}

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

/** Model for the response of the getApplicationFeatures query */
export interface GetApplicationFeaturesQueryResponse {
  application: Application;
}

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

/** Model for the response of the getWorkflowSteps query */
export interface GetWorkflowStepsQueryResponse {
  workflow: Workflow;
}

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

/** Interface of Get Resources Query response */
export interface GetResourcesQueryResponse {
  resources: {
    edges: {
      node: Resource;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

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

/** Interface of Get Resource Query response */
export interface GetResourceQueryResponse {
  resource: Resource;
}

/** Graphql request for getting groups */
export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      title
    }
  }
`;

/** Model for GetGroupsQueryResponse object */
export interface GetGroupsQueryResponse {
  groups: Group[];
}
