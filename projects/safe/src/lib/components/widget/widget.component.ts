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
  @Input() canUpdate = false;

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /** Constructor of the class */
  constructor() {}

  ngOnInit(): void {}

  /**
   * Emits edition event.
   *
   * @param e widget to edit.
   */
  onEditWidget(e: any): void {
    this.edit.emit(e);
  }
}
