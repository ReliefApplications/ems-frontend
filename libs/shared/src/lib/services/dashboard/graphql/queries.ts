import { gql } from 'apollo-angular';

/** Get resource by id to get its download permission */
export const GET_RESOURCE_DOWNLOAD_PERMISSION = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      permissions {
        canDownloadRecords
      }
    }
  }
`;
