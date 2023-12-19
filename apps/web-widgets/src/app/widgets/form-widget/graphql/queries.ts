import gql from 'graphql-tag';

// === GET FORM BY ID ===
/** Get form query */
export const GET_SHORT_FORM_BY_ID = gql`
  query GetShortFormById($id: ID!) {
    form(id: $id) {
      id
      name
      structure
      fields
      status
      queryName
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
      }
      canUpdate
      metadata {
        name
        automated
        canSee
        canUpdate
      }
      resource {
        id
        name
      }
    }
  }
`;
