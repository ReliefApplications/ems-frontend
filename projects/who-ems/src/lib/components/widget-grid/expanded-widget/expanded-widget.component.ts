import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'who-expanded-widget',
  templateUrl: './expanded-widget.component.html',
  styleUrls: ['./expanded-widget.component.scss']
})
export class WhoExpandedWidgetComponent implements OnInit {

  @Input() widget: any;

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<WhoExpandedWidgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      widget: any
    }
  ) { }

  ngOnInit(): void {
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
