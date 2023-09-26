import { gql } from 'apollo-angular';
import { Role, User } from '../../models/user.model';
import { Resource } from '../../models/resource.model';
import { Person } from '../../models/people.model';

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

/** Model for GetRolesFromApplicationsQueryResponse object */
export interface GetRolesFromApplicationsQueryResponse {
  rolesFromApplications: Role[];
}

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

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}

// === GET USERS ===

/** Graphql request for getting users (optionnally by a list of application ids) */
export const GET_USERS = gql`
  query GetUsers($applications: [ID]) {
    users(applications: $applications) {
      id
      username
      name
      oid
    }
  }
`;

/** Model for GetUsersQueryResponse object */
export interface GetUsersQueryResponse {
  users: User[];
}

// === GET PEOPLE ===

/** Graphql request for getting people */
export const GET_PEOPLE = gql`
  query GetPeople($applications: [ID]) {
    people(applications: $applications) {
      id
      username
      name
      oid
    }
  }
`;

/** Model for GetPeopleQueryResponse object */
export interface GetPeopleQueryResponse {
  people: Person[];
}
