import { gql } from 'apollo-angular';

/** Graphql request  for listening to unlocking of applications */
export const APPLICATION_UNLOCKED_SUBSCRIPTION = gql`
  subscription applicationUnlocked($id: ID!) {
    applicationUnlocked(id: $id) {
      id
      locked
      lockedByUser
    }
  }
`;

/** Graphql request for listening to editing of applications */
export const APPLICATION_EDITED_SUBSCRIPTION = gql`
  subscription applicationEdited($id: ID!) {
    applicationEdited(id: $id) {
      id
      name
      description
      createdAt
      status
      canSee
      canUpdate
      lockedBy {
        id
        name
      }
    }
  }
`;
