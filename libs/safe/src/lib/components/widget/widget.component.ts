import { Component, Input, Output, EventEmitter } from '@angular/core';

/** Component for the widgets */
@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class SafeWidgetComponent {
  @Input() widget: any;
  @Input() header = true;
  @Input() canUpdate = false;

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();
}
