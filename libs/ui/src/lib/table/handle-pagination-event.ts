import { UIPageChangeEvent } from '../paginator/interfaces/paginator.interfaces';

/**
 * Handles the page event effect of the table for the given page info and table items
 * Would return undefined if no data is fetched from the current table items, otherwise return paginated table items
 *
 * @param e UIPageChangeEvent
 * @param pageInfo pageInfo of the current table
 * @param pageInfo.pageIndex page index
 * @param pageInfo.pageSize page size
 * @param pageInfo.length length
 * @param pageInfo.endCursor graphql endCursor
 * @param currentTableItems current items in the table
 * @returns cached information of the table if exists or undefined
 */
export function handleTablePageEvent<T>(
  e: UIPageChangeEvent,
  pageInfo: {
    pageIndex: number;
    pageSize: number;
    length: number;
    endCursor: string;
  },
  currentTableItems: T[]
): T[] | undefined {
  let tableItemsFromCache!: T[];
  pageInfo.pageIndex = e.pageIndex;
  // Checks if with new page/size more data needs to be fetched
  if (
    ((e.pageIndex > e.previousPageIndex &&
      e.pageIndex * pageInfo.pageSize >= currentTableItems.length) ||
      e.pageSize > pageInfo.pageSize) &&
    e.totalItems > currentTableItems.length
  ) {
    // Sets the new fetch quantity of data needed as the page size
    // If the fetch is for a new page the page size is used
    let first = e.pageSize;
    // If the fetch is for a new page size, the old page size is subtracted from the new one
    if (e.pageSize > pageInfo.pageSize) {
      first -= pageInfo.pageSize;
    }
    pageInfo.pageSize = first;
  } else {
    tableItemsFromCache = currentTableItems.slice(
      e.pageSize * pageInfo.pageIndex,
      e.pageSize * (pageInfo.pageIndex + 1)
    );
  }
  pageInfo.pageSize = e.pageSize;

  return tableItemsFromCache;
}
