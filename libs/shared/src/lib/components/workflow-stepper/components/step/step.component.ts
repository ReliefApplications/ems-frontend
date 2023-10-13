import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CONTENT_TYPES, IContentType } from '../../../../models/page.model';
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
  /** Active status */
  @Input() active = false;
  /** Update permission */
  @Input() canUpdate = false;
  /** Delete event emitter */
  @Output() delete = new EventEmitter();
  /** Duplicate event emitter */
  @Output() duplicate = new EventEmitter();

  /** @returns The type of the step */
  get type(): IContentType | undefined {
    return CONTENT_TYPES.find((x) => x.name === this.step.type);
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
