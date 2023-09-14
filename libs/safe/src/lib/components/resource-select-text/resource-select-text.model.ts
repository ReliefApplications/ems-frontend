import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../../survey/components/utils/custom-components.enum';

export class QuestionResourceSelectTextModel extends Question {
  override getType() {
    return CustomPropertyGridComponentTypes.resourceSelectText;
  }
}
