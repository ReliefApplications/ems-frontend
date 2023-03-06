import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
export class SafeExpandedWidgetComponent implements OnInit {
  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /**
   * Constructor for the component
   *
   * @param data The input data for the dialog
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}
}
