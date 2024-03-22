import { gql } from '@apollo/client';

/** Graphql request for getting people */
export const GET_PEOPLE = gql`
  query GetPeople($filter: JSON) {
    people(filter: $filter) {
      id
      firstname
      lastname
      emailaddress
    }
  }
`;
