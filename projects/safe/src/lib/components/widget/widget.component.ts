import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/** Component for the widgets */
@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class SafeWidgetComponent implements OnInit {
  @Input() widget: any;
  @Input() header = true;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /** Constructor of the class */
  constructor() {}

  ngOnInit(): void {}
}
