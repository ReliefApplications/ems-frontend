import { gql } from 'apollo-angular';

/** Graphql request for getting channels */
export const GET_CHANNELS = gql`
  query getChannels($application: ID) {
    channels(application: $application) {
      id
      title
    }
  }
`;
