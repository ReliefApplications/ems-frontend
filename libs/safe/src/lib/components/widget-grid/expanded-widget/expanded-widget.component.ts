import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';

/** Dialog data */
interface DialogData {
  widget: any;
}

/** Component for expanded widgets */
@Component({
  selector: 'safe-expanded-widget',
  templateUrl: './expanded-widget.component.html',
  styleUrls: ['./expanded-widget.component.scss'],
})
export class SafeExpandedWidgetComponent {
  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /**
   * Constructor for the component
   *
   * @param data The input data for the dialog
   */
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {}
}
