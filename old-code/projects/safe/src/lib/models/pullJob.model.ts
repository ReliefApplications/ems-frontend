import { ApiConfiguration } from './apiConfiguration.model';
import { status } from './form.model';
import { Channel } from './channel.model';
import { Form } from './form.model';

/** Model for PullJob object. */
export interface PullJob {
  id?: string;
  name?: string;
  status?: status;
  apiConfiguration?: ApiConfiguration;
  url?: string;
  path?: string;
  schedule?: string;
  convertTo?: Form;
  mapping?: any;
  uniqueIdentifiers?: string[];
  channel?: Channel;
}
