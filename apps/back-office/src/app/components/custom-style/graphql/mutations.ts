import { gql } from 'apollo-angular';

/** Graphql request for save the custom scss application file */
export const UPLOAD_APPLICATION_STYLE = gql`
  mutation uploadApplicationStyle($file: Upload!, $application: ID!) {
    uploadApplicationStyle(file: $file, application: $application)
  }
`;
