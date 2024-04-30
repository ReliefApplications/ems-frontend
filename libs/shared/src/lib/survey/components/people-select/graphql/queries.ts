import { gql } from '@apollo/client';

/** Graphql request for getting people */
export const GET_PEOPLE = gql`
  query GetPeople($filter: JSON, $offset: Int) {
    people(filter: $filter, offset: $offset) {
      id
      firstname
      lastname
      emailaddress
    }
  }
`;
