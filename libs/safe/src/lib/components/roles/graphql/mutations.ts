import { gql } from 'apollo-angular';

// === DELETE ROLE ===

/** Graphql request for deleting a role by its id */
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

// === ADD ROLE ===

/** Graphql request for adding a new role to an application */
export const ADD_ROLE = gql`
  mutation addRole($title: String!, $application: ID) {
    addRole(title: $title, application: $application) {
      id
      title
      permissions {
        id
        type
      }
    }
  }
`;

// === ADD GROUP ===

/** Graphql request for adding a new group to an application */
export const ADD_GROUP = gql`
  mutation addGroup($title: String!) {
    addGroup(title: $title) {
      id
      title
    }
  }
`;

// === DELETE GROUP ===

/** Graphql request for deleting a group by its id */
export const DELETE_GROUP = gql`
  mutation deleteGroup($id: ID!) {
    deleteGroup(id: $id) {
      id
    }
  }
`;

// === FETCH GROUPS FROM SERVICE ===
/** Graphql request for adding a new group to an application */
export const FETCH_GROUPS = gql`
  mutation FetchGroups {
    fetchGroups {
      id
      title
      usersCount
    }
  }
`;
