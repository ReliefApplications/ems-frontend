import { gql } from 'apollo-angular';

/** Graphql query for getting users */
export const GET_USERS = gql`
  {
    users {
      id
      username
      name
      roles {
        id
        title
        application {
          id
        }
      }
      oid
    }
  }
`;
