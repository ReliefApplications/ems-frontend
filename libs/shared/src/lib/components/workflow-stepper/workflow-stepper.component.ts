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
  @Input() activeStep = 0;
  @Input() steps: Step[] = [];
  @Input() canUpdate = false;
  @Input() loading = false;
  @Output() add = new EventEmitter();
  @Output() delete = new EventEmitter<number>();
  @Output() openStep = new EventEmitter<number>();
  @Output() reorderSteps = new EventEmitter<Step[]>();
  public dragging = false;

  /** Activate draging */
  onDragStart(): void {
    this.dragging = true;
  }

  /**
   * Open a step on click
   *
   * @param index Index of the step
   */
  onStep(index: number): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    if (this.activeStep !== index) {
      this.openStep.emit(index);
    }
  }

  /**
   * Drop a step dragged into the list.
   *
   * @param event Drag and drop on mouse release event
   */
  dropStep(event: CdkDragDrop<string[]>): void {
    this.dragging = false;
    const reorderedSteps = this.steps.slice();
    moveItemInArray(reorderedSteps, event.previousIndex, event.currentIndex);
    this.steps = reorderedSteps;
    if (event.previousIndex !== event.currentIndex) {
      this.reorderSteps.emit(this.steps);
    }
  }
}
