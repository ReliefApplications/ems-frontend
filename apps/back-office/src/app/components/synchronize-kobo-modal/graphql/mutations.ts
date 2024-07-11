import { gql } from 'apollo-angular';

/** Edit form Kobo preferences gql mutation definition */
export const EDIT_FORM_KOBO_PREFERENCES = gql`
  mutation editForm($id: ID!, $dataFromDeployedVersion: Boolean) {
    editForm(id: $id, dataFromDeployedVersion: $dataFromDeployedVersion) {
      id
      name
      kobo {
        dataFromDeployedVersion
      }
    }
  }
`;

/** For the form created from a Kobotoolbox form, import data submissions to create records. */
export const ADD_RECORDS_FROM_KOBO = gql`
  mutation addRecordsFromKobo($form: ID!) {
    addRecordsFromKobo(form: $form)
  }
`;
