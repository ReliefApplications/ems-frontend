import { gql } from '@apollo/client';

/** Graphql request for getting people */
export const GET_PEOPLE = gql`
  query GetPeople($filter: JSON, $offset: Int, $limitItems: Int) {
    people(filter: $filter, offset: $offset, limitItems: $limitItems) {
      id
      firstname
      lastname
      emailaddress
    }
  }
`;
