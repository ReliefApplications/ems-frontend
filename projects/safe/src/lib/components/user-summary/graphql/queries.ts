import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';
import { Group, Role, User } from '../../../models/user.model';
import { USER_FIELDS } from './fragments';

/** Graphql query to get user by id */
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

/** GraphQL interface of get user by id query */
export interface GetUserQueryResponse {
  loading: boolean;
  user: User;
}

/** Get Applications query */
export const GET_APPLICATIONS = gql`
  query GetApplications($first: Int, $afterCursor: ID) {
    applications(first: $first, afterCursor: $afterCursor, sortField: "name") {
      edges {
        node {
          id
          name
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Interface of Get Applications query */
export interface GetApplicationsQueryResponse {
  loading: boolean;
  applications: {
    edges: {
      node: Application;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

/** Get Roles query */
export const GET_ROLES = gql`
  query GetRoles($application: ID) {
    roles(application: $application) {
      id
      title
    }
  }
`;

/** Interface of Get Roles query */
export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
}

/** Graphql request for getting groups */
export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      title
      usersCount
    }
  }
`;

/** Model for GetGroupsQueryResponse object */
export interface GetGroupsQueryResponse {
  loading: boolean;
  groups: Group[];
}
