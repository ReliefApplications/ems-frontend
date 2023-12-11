import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../utils/components.enum';

/**
 * Extended reference data dropdown question class for survey creators property grid editor
 */
export class QuestionReferenceDataDropdownModel extends Question {
  /**
   * Return the registered question type in the survey serializer
   *
   * @returns {CustomPropertyGridComponentTypes} question type
   */
  override getType() {
    return CustomPropertyGridComponentTypes.referenceDataDropdown;
  }
}
