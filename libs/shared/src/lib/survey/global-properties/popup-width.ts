import { JsonMetadata, Serializer } from 'survey-core';

/**
 * Add support for custom properties to the survey
 *
 */
export const init = (): void => {
  const serializer: JsonMetadata = Serializer;

  for (const type of ['dropdown']) {
    // add minimumPopupWidth property
    serializer.addProperty(type, {
      name: 'minimumPopupWidth:number',
      category: 'general',
      default: null,
    });
  }
};
