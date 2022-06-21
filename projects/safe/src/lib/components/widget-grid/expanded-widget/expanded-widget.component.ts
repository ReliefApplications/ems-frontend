import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Dialog data */
interface DialogData {
  widget: any;
}

/** Component for expdanded widgets */
@Component({
  selector: 'safe-expanded-widget',
  templateUrl: './expanded-widget.component.html',
  styleUrls: ['./expanded-widget.component.scss'],
})
export class SafeExpandedWidgetComponent implements OnInit {
  @Input() widget: any;

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /**
   * Constructor for the component
   *
   * @param dialogRef Reference to a dialog from the material dialog service
   * @param data The input data for the dialog
   */
  constructor(
    public dialogRef: MatDialogRef<SafeExpandedWidgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
