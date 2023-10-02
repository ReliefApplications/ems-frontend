/**
 * GraphQL query structure response
 */
export interface GraphqlNodesResponse<T> {
  edges: {
    node: T;
    cursor: string;
  }[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  totalCount: number;
}
