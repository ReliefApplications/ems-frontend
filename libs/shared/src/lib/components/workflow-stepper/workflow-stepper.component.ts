import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Step } from '../../models/step.model';

/**
 * Component for workflow stepper
 */
@Component({
  selector: 'shared-workflow-stepper',
  templateUrl: './workflow-stepper.component.html',
  styleUrls: ['./workflow-stepper.component.scss'],
})
export class WorkflowStepperComponent {
  /** Active step */
  @Input() activeStep = 0;
  /** Steps */
  @Input() steps: Step[] = [];
  /** Update permission */
  @Input() canUpdate = false;
  /** Loading status */
  @Input() loading = false;
  /** Add event emitter */
  @Output() add = new EventEmitter();
  /** Delete event emitter */
  @Output() delete = new EventEmitter<number>();
  /** Open step event emitter */
  @Output() openStep = new EventEmitter<number>();
  /** Reorder steps event emitter   */
  @Output() reorderSteps = new EventEmitter<Step[]>();

  /**
   * Open a step on click
   *
   * @param index Index of the step
   */
  onStep(index: number): void {
    if (this.activeStep !== index) {
      this.openStep.emit(index);
    }
  }

  /**
   * Drop a step dragged into the list.
   *
   * @param event Drag and drop on mouse release event
   */
  onReorder(event: CdkDragDrop<string[]>): void {
    const reorderedSteps = this.steps.slice();
    moveItemInArray(reorderedSteps, event.previousIndex, event.currentIndex);
    this.steps = reorderedSteps;
    if (event.previousIndex !== event.currentIndex) {
      this.reorderSteps.emit(this.steps);
    }
  }
}
