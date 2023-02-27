import { gql } from 'apollo-angular';

/** GraphQL user fields for user summary  */
export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    username
    firstName
    lastName
    roles {
      id
      title
      application {
        id
      }
    }
    groups {
      id
      title
    }
    oid
    attributes
  }
`;
