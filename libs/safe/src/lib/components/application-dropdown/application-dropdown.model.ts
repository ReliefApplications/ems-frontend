import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../../survey/components/property-grid-components/components.enum';

/**
 * Extended applications dropdown question class for survey creators property grid editor
 */
export class QuestionOwnerApplicationsDropdownModel extends Question {
  /**
   * Return the registered question type in the survey serializer
   *
   * @returns {CustomPropertyGridComponentTypes} question type
   */
  override getType() {
    return CustomPropertyGridComponentTypes.applicationsDropdown;
  }
}
