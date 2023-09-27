import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentType } from '../../../../models/page.model';
import { Step } from '../../../../models/step.model';

/** Component for steps in workflow */
@Component({
  selector: 'shared-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
export class StepComponent {
  @Input() step!: Step;
  @Input() active = false;
  @Input() canUpdate = false;
  @Output() delete = new EventEmitter();
  @Output() duplicate = new EventEmitter();

  /** @returns The icon name for the step type */
  get typeIcon(): string {
    switch (this.step.type) {
      case ContentType.workflow:
        return 'linear_scale';
      case ContentType.form:
        return 'description';
      default:
        return 'dashboard';
    }
  }

  /**
   * Emits delete event.
   *
   * @param e click event.
   */
  public onDelete(e: any): void {
    e.stopPropagation();
    this.delete.emit();
  }
}
