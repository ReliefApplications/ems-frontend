import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Step } from '../../models/step.model';

@Component({
  selector: 'safe-workflow-stepper',
  templateUrl: './workflow-stepper.component.html',
  styleUrls: ['./workflow-stepper.component.scss']
})
export class SafeWorkflowStepperComponent implements OnInit {

  @Input() activeStep = 0;
  @Input() steps: Step[] = [];
  @Input() canUpdate = false;
  @Output() add = new EventEmitter();
  @Output() openStep = new EventEmitter<Step>();

  constructor() { }

  ngOnInit(): void {
  }

}
