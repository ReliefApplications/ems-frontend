import { JsonMetadata, Serializer } from 'survey-core';

/**
 * Add support for custom properties to the survey
 *
 */
export const init = (): void => {
  const serializer: JsonMetadata = Serializer;

  for (const type of ['dropdown']) {
    // add popupWidth property
    serializer.addProperty(type, {
      name: 'popupWidth:number',
      category: 'general',
      isLocalizable: true,
    });
  }
};
