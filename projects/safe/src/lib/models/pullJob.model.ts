import { ApiConfiguration, status } from './apiConfiguration.model';
import { Channel } from './channel.model';
import { Form } from './form.model';

/*  Model for PullJob object.
*/
export interface PullJob {
    id?: string;
    name?: string;
    status?: status;
    apiConfiguration?: ApiConfiguration;
    schedule?: string;
    convertTo?: Form;
    mapping?: any;
    channel?: Channel;
}
