import { Form } from './form.model';
import { Resource } from './resource.model';

/**
 * Model for field metadata object
 */
export interface Metadata {
  name: string;
  automated?: boolean;
  type?: string;
  editor?: string;
  filter?: { defaultOperator?: string; operators: string[] };
  canSee?: boolean;
  canUpdate?: boolean;
  multiSelect?: boolean;
  filterable?: boolean;
  options?: { text: string; value: any }[];
  fields?: Metadata[];
  usedIn?: string[];
}

// TODO: check type of __schema
/** Model for query types  */
export interface QueryTypes {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __schema: any;
}

/** Model for query metadata query response */
export interface QueryMetaDataQueryResponse {
  form: Form;
  resource: Resource;
}
