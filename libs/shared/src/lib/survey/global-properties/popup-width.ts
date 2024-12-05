import { QuestionType } from './../../services/form-helper/form-helper.service';
import { JsonMetadata, Serializer } from 'survey-core';

/**
 * Add support for custom properties to the survey
 *
 */
export const init = (): void => {
  const serializer: JsonMetadata = Serializer;

  for (const type of [QuestionType.DROPDOWN, QuestionType.TAGBOX]) {
    // add popupWidth property
    serializer.addProperty(type, {
      name: 'popupWidth:number',
      displayName: 'Popup width (in pixels)',
      category: 'general',
      default: null,
      minValue: 0,
    });
  }
};
