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

/** Model for query metadata query response */
export interface QueryMetaDataQueryResponse {
  form: Form;
  resource: Resource;
}

/** Model for query types */
export type QueryTypesResponse = {
  types: {
    availableQueries: any[];
    userFields: any[];
  };
};
