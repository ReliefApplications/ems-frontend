import { Question } from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../../survey/components/utils/custom-components.enum';

export class QuestionTestServiceDropdownModel extends Question {
  override getType() {
    return CustomPropertyGridComponentTypes.resourceTestService;
  }

  get resource() {
    return this.getPropertyValue('resource');
  }
  set resource(val) {
    this.setPropertyValue('resource', val);
  }

  get displayField() {
    return this.getPropertyValue('displayField');
  }
  set displayField(val) {
    this.setPropertyValue('displayField', val);
  }
}
