import { ApolloClientOptions, ApolloQueryResult } from '@apollo/client';
import { QueryRef } from 'apollo-angular';
import { unionBy } from 'lodash';

/**
 * Returns the path to given property to find from the given item
 * @param item Item from which we extract the property path
 * @param propertyToFind Property that we want to find in the given item
 * @returns {string} The complete path to the property
 */
const getRefPathPropertyFromItem = (
  item: any,
  propertyToFind: string
): string => {
  const objectKeys = Object.keys(item);
  let fullPath = '';
  if (!objectKeys.length) {
    return item;
  }
  if (objectKeys.includes(propertyToFind)) {
    return propertyToFind;
  } else {
    for (const objectKey of objectKeys) {
      if (typeof item[objectKey] === 'object') {
        const pathResult = getRefPathPropertyFromItem(
          item[objectKey],
          propertyToFind
        );
        fullPath = objectKey + '.' + pathResult;
        if (pathResult === propertyToFind) {
          break;
        }
      } else {
        continue;
      }
    }
  }
  return fullPath;
};

/**
 * Return a new query response with the given type merging incoming and new responses
 * @param prev Previous query response
 * @param fetchMoreResult New query response
 * @param property Property to access the data in the responses
 * @param uniqueComparatorProperty Property used as filter duplicated data to merge that same data from both responses
 * @returns
 */
const updateQueryUniqueValues = <T>(
  prev: T,
  fetchMoreResult: T,
  property: keyof T,
  uniqueComparatorProperty: string
): T => {
  if (!fetchMoreResult) {
    return prev;
  }
  const previousDataContent: any = prev[property];
  const fetchMoreResultContent: any = fetchMoreResult[property];
  const refPath = getRefPathPropertyFromItem(
    fetchMoreResultContent.edges[0],
    uniqueComparatorProperty
  );
  const uniqueEdges = unionBy(
    previousDataContent.edges,
    fetchMoreResultContent.edges,
    refPath
  );
  return Object.assign({}, previousDataContent, {
    [property]: {
      edges: uniqueEdges,
      pageInfo: fetchMoreResultContent.pageInfo,
      totalCount: fetchMoreResultContent.totalCount,
    },
  });
};

/**
 *
 * Updates the given query cache with the new incoming values merged in data as an unique array of items
 * @param apolloClient Apollo client service with the config set in the origin module
 * @param queryRef Query reference from which retrieve data if needed
 * @param queryValue Query to update
 * @param incomingData Query response data of given type
 * @param property Property name to access the query response to retrieve data
 * @param uniqueComparatorProperty Comparator property in response items used to merge incoming and previous data in the given query
 * @param incomingDataAsSource Mark incoming data as source data as well
 * @returns Updated response query of given type
 */
export const updateGivenQuery = <T>(
  apolloClient: ApolloClientOptions<any>,
  queryRef: QueryRef<T, any>,
  queryValue: any,
  incomingData: ApolloQueryResult<T>,
  property: keyof T,
  uniqueComparatorProperty: string,
  incomingDataAsSource: boolean = false
): T => {
  let newQuery!: T;
  apolloClient.cache.updateQuery({ query: queryValue }, (data: T | null) => {
    newQuery = updateQueryUniqueValues<T>(
      // If the source of the update is a filter then the current data is the origin, not the cache one
      incomingDataAsSource
        ? incomingData.data
        : data ?? queryRef.getCurrentResult().data,
      incomingData.data,
      property,
      uniqueComparatorProperty
    );
  });
  return newQuery;
};
