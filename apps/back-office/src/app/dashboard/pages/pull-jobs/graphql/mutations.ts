import { gql } from 'apollo-angular';

// === EDIT PULL JOB ===
/** Edit pull job gql mutation definition */
export const EDIT_PULL_JOB = gql`
  mutation editPullJob(
    $id: ID!
    $name: String
    $status: Status
    $apiConfiguration: ID
    $url: String
    $path: String
    $schedule: String
    $convertTo: ID
    $mapping: JSON
    $uniqueIdentifiers: [String]
    $channel: ID
  ) {
    editPullJob(
      id: $id
      name: $name
      status: $status
      apiConfiguration: $apiConfiguration
      url: $url
      path: $path
      schedule: $schedule
      convertTo: $convertTo
      mapping: $mapping
      uniqueIdentifiers: $uniqueIdentifiers
      channel: $channel
    ) {
      id
      name
      status
      apiConfiguration {
        id
        name
      }
      schedule
      convertTo {
        id
        name
      }
      mapping
      uniqueIdentifiers
      channel {
        id
        title
      }
    }
  }
`;

// === DELETE PULL JOB ===
/** Delete pull job gql mutation definition */
export const DELETE_PULL_JOB = gql`
  mutation deletePullJob($id: ID!) {
    deletePullJob(id: $id) {
      id
    }
  }
`;

// === ADD PULL JOB ===
/** Add pull job gql mutation definition */
export const ADD_PULL_JOB = gql`
  mutation addPullJob(
    $name: String!
    $status: Status!
    $apiConfiguration: ID!
    $url: String
    $path: String
    $schedule: String
    $convertTo: ID
    $mapping: JSON
    $uniqueIdentifiers: [String]
    $channel: ID
  ) {
    addPullJob(
      name: $name
      status: $status
      apiConfiguration: $apiConfiguration
      url: $url
      path: $path
      schedule: $schedule
      convertTo: $convertTo
      mapping: $mapping
      uniqueIdentifiers: $uniqueIdentifiers
      channel: $channel
    ) {
      id
      name
      status
      apiConfiguration {
        id
        name
      }
      schedule
      convertTo {
        id
        name
      }
      mapping
      uniqueIdentifiers
      channel {
        id
        title
      }
    }
  }
`;
