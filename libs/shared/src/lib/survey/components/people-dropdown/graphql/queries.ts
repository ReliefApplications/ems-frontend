import { gql } from 'apollo-angular';

/**
 * Search people in Common Services
 */
export const SEARCH_PEOPLE = gql`
  query SearchPeople($filter: JSON, $first: Int, $skip: Int) {
    users(
      limitItems: $first
      offset: $skip
      sortBy: { field: "firstname", direction: "ASC" }
      filter: $filter
    ) {
      userid
      firstname
      lastname
      emailaddress
    }
  }
`;

/**
 * Fetch people by userid
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
