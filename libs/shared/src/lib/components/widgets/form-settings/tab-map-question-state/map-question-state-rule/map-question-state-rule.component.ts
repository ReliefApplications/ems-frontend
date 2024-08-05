import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Map question value to state rule.
 */
@Component({
  selector: 'shared-map-question-state-rule',
  templateUrl: './map-question-state-rule.component.html',
  styleUrls: ['./map-question-state-rule.component.scss'],
})
export class MapQuestionStateRuleComponent {
  /** Filter form group */
  @Input() form!: UntypedFormGroup;
  /** Array of available questions in the selected form */
  @Input() questions: any[] = [];
  /** Array of available states in the dashboard */
  @Input() states: any[] = [];
  /** Delete filter event emitter */
  @Output() delete = new EventEmitter();

  /** Toggles the direction */
  public toggleDirection = () => {
    const direction = this.form.get('direction')?.value;
    this.form
      .get('direction')
      ?.setValue(
        direction === 'both'
          ? 'questionToState'
          : direction === 'questionToState'
          ? 'stateToQuestion'
          : 'both'
      );
  };
}
