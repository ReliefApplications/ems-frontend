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
