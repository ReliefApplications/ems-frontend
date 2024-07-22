import { gql } from 'apollo-angular';

/** Edit form Kobo preferences gql mutation definition */
export const EDIT_FORM_KOBO_PREFERENCES = gql`
  mutation editForm(
    $id: ID!
    $dataFromDeployedVersion: Boolean
    $cronSchedule: String
  ) {
    editForm(
      id: $id
      dataFromDeployedVersion: $dataFromDeployedVersion
      cronSchedule: $cronSchedule
    ) {
      id
      name
      kobo {
        dataFromDeployedVersion
        cronSchedule
      }
    }
  }
`;
