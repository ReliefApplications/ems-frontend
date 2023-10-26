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
  /** Input step */
  @Input() step!: Step;
  /** Update permission */
  @Input() canUpdate = false;
  /** Delete event emitter */
  @Output() delete = new EventEmitter();

  /** @returns Default icon based on type of step */
  get defaultIcon(): string {
    switch (this.step.type) {
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
