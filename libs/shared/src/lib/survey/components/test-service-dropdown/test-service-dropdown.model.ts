import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../utils/components.enum';

/**
 * Extended test service dropdown question class for survey creators property grid editor
 */
export class QuestionTestServiceDropdownModel extends Question {
  /**
   * Return the registered question type in the survey serializer
   *
   * @returns {CustomPropertyGridComponentTypes} question type
   */
  override getType() {
    return CustomPropertyGridComponentTypes.resourceTestService;
  }
}
