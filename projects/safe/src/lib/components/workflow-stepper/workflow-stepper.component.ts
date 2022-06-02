import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Step } from '../../models/step.model';

@Component({
  selector: 'safe-workflow-stepper',
  templateUrl: './workflow-stepper.component.html',
  styleUrls: ['./workflow-stepper.component.scss'],
})
export class SafeWorkflowStepperComponent implements OnInit {
  @Input() activeStep = 0;
  @Input() steps: Step[] = [];
  @Input() canUpdate = false;
  @Output() add = new EventEmitter();
  @Output() delete = new EventEmitter<number>();
  @Output() openStep = new EventEmitter<number>();
  @Output() reorderSteps = new EventEmitter<Step[]>();
  public dragging = false;

  constructor() {}

  ngOnInit(): void {}

  onDragStart(): void {
    this.dragging = true;
  }

  onStep(index: number): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    if (this.activeStep !== index) {
      this.openStep.emit(index);
    }
  }

  /** Drop a step dragged into the list */
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
