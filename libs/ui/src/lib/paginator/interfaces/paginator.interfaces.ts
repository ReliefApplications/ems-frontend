/**
 * Information thrown on page change event
 */
export interface UIPageChangeEvent {
  pageSize: number;
  skip: number;
  totalItems: number;
  pageIndex: number;
  previousPageIndex: number;
}
