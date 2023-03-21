export type Connection<T> = {
  totalCount: number;
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
  };
};
