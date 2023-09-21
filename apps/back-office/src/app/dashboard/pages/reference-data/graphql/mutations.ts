import { gql } from 'apollo-angular';

// === EDIT REFERENCE DATA ===
/** Edit ref data gql mutation definition */
export const EDIT_REFERENCE_DATA = gql`
  mutation editReferenceData(
    $id: ID!
    $name: String
    $type: ReferenceDataType
    $apiConfiguration: ID
    $query: String
    $fields: JSON
    $valueField: String
    $path: String
    $data: JSON
    $graphQLFilter: String
    $permissions: JSON
  ) {
    editReferenceData(
      id: $id
      name: $name
      type: $type
      apiConfiguration: $apiConfiguration
      query: $query
      fields: $fields
      valueField: $valueField
      path: $path
      data: $data
      graphQLFilter: $graphQLFilter
      permissions: $permissions
    ) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;
