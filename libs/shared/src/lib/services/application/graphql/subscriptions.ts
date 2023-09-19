import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';

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

/** Model for ApplicationUnlockedSubscriptionResponse object */
export interface ApplicationUnlockedSubscriptionResponse {
  applicationUnlocked: Application;
}

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

/** Model for ApplicationEditeSubscriptionResponse obejct */
export interface ApplicationEditedSubscriptionResponse {
  applicationEdited: Application;
}
