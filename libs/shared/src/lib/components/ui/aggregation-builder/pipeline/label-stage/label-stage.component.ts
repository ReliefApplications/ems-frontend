import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Component that handles labeling
 */
@Component({
  selector: 'shared-label-stage',
  templateUrl: './label-stage.component.html',
  styleUrls: ['./label-stage.component.scss'],
})
export class LabelStageComponent {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;
  @Input() metaFields: any[] = [];

  /**
   * Returns the list of choice question names
   * @returns the list of choice question names
   */
  public getChoiceQuestionNames() {
    const choiceQuestionTypes = [
      'dropdown',
      'checkbox',
      'radiogroup',
      'tagbox',
      'matrixdropdown',
      'matrixdynamic',
    ];
    return Object.entries(this.metaFields)
      .filter(([, value]) => choiceQuestionTypes.includes(value.type))
      .map(([, value]) => value.name);
  }
}
