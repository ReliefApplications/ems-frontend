import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../utils/components.enum';

/**
 * Extended applications dropdown question class for survey creators property grid editor
 */
export class QuestionDateTypeDisplayerModel extends Question {
  /**
   * Return the registered question type in the survey serializer
   *
   * @returns {CustomPropertyGridComponentTypes} question type
   */
  override getType() {
    return CustomPropertyGridComponentTypes.dateTypeDisplayer;
  }

  /**
   * inputType property of QuestionDateTypeDisplayerModel
   *
   * @returns what type of input type has to render the question
   */
  get inputType() {
    return this.getPropertyValue('inputType');
  }

  /**
   * inputType property of QuestionDateTypeDisplayerModel to set the correct renderer element on displaying the date question
   */
  set inputType(value: string) {
    this.setPropertyValue('inputType', value);
  }
}
