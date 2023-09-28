import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../utils/components.enum';

/**
 * Extended resources dropdown question class for survey creators property grid editor
 */
export class QuestionResourceDropdownModel extends Question {
  /**
   * Return the registered question type in the survey serializer
   *
   * @returns {CustomPropertyGridComponentTypes} question type
   */
  override getType() {
    return CustomPropertyGridComponentTypes.resourcesDropdown;
  }
}
