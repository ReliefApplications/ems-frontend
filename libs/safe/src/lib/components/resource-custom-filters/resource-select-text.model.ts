import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../../survey/components/utils/custom-components.enum';

export class QuestionResourceCustomFiltersModel extends Question {
  override getType() {
    return CustomPropertyGridComponentTypes.resourceCustomFilters;
  }
}
