/**
 * Interface for Aggregation objects.
 */
export interface Aggregation {
  id?: string;
  name?: string;
  sourceFields?: any;
  pipeline?: any;
}
