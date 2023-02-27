/**
 * Interface for Aggregation objects.
 */
export interface Aggregation {
  id?: string;
  name?: string;
  sourceFields?: any;
  pipeline?: any;
}

/** Model for AggregationConnection object */
export interface AggregationConnection {
  totalCount: number;
  edges: {
    node: Aggregation;
    cursor: string;
  }[];
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
  };
}
