import { ApolloClientOptions } from '@apollo/client';
import { unionBy } from 'lodash';

/**
 * Returns the path to given property to find from the given item
 *
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
 * Merge given previousDataContent and currentDataContent into an array with no repeated items
 *
 * @param previousDataContent Previous array of items to merge
 * @param currentDataContent Current array of items to merge
 * @param uniqueComparatorProperty Property used to discriminate repeated items on merging previousDataContent and currentDataContent
 * @returns Merged array
 */
export const updateQueryUniqueValues = <T>(
  previousDataContent: T[],
  currentDataContent: T[],
  uniqueComparatorProperty: string = 'id'
): T[] => {
  if (!currentDataContent || !currentDataContent?.length) {
    return previousDataContent;
  }
  let response: T[] = [];
  if (currentDataContent[0]) {
    const refPath = getRefPathPropertyFromItem(
      currentDataContent[0],
      uniqueComparatorProperty
    );
    // todo: type issue
    response = unionBy(previousDataContent, currentDataContent, refPath as any);
  }
  return response;
};

/**
 * Returns values from client cache for the given query
 *
 * @param apolloClient ApolloClient config
 * @param query Query used to fetch content
 * @param variables Variables used for the Query
 * @returns Cache values
 */
export const getCachedValues = <T>(
  apolloClient: ApolloClientOptions<any>,
  query: any,
  variables: object
): T => {
  const cachedValues = apolloClient.cache.readQuery({
    query,
    variables,
  }) as T;
  return cachedValues as T;
};
