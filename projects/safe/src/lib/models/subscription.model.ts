import { Form } from './form.model';
import { Channel } from './channel.model';

export interface Subscription {
    routingKey?: string;
    title?: string;
    convertTo?: Form;
    channel?: Channel;
}
