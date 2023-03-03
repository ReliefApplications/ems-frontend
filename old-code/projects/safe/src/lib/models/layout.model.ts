/**
 * Interface for Layout objects.
 */
export interface Layout {
  id?: string;
  name?: string;
  query?: any;
  display?: any;
}

/** Model for LayoutConnection object */
export interface LayoutConnection {
  totalCount: number;
  edges: {
    node: Layout;
    cursor: string;
  }[];
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
  };
}
