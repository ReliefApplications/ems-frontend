/**
 * Available fields object
 */
export interface FieldStore {
  name: string;
  type: string;
  fields?: string[] | null;
  __typename: string;
  parentName?: string | null;
  childName?: string | null;
  childType?: string | null;
  options?: string[] | null;
  multiSelect?: boolean | null;
  select?: boolean | null;
}
