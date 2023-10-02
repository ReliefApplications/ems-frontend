import { Form } from './form.model';
import { Channel } from './channel.model';

/** Model for subscription object. */
export interface Subscription {
  routingKey?: string;
  title?: string;
  convertTo?: Form;
  channel?: Channel;
}

/** Model for add subscription mutation response */
export interface AddSubscriptionMutationResponse {
  addSubscription: Subscription;
}

/** Model for edit subscription mutation response */
export interface EditSubscriptionMutationResponse {
  editSubscription: Subscription;
}

/** Model for delete subscription mutation response */
export interface DeleteSubscriptionMutationResponse {
  deleteSubscription: Subscription;
}
