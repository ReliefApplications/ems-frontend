import { gql } from 'apollo-angular';

/**
 * Fetch people by userid.
 * Used when editing a record or displaying records in grid/card/details view.
 */
export const GET_PEOPLE_BY_ID = gql`
  query GetPeopleById($ids: [String!]) {
    users(filter: { userid_in: $ids }) {
      userid
      firstname
      lastname
      emailaddress
    }
  }
`;
