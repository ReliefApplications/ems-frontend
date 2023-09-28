import { JsonMetadata, Serializer } from 'survey-core';

/**
 * Add support for custom properties to the survey
 *
 */
export const init = (): void => {
  const serializer: JsonMetadata = Serializer;

  // add tooltip property
  serializer.addProperty('question', {
    name: 'tooltip:text',
    category: 'general',
    isLocalizable: true,
  });
};
