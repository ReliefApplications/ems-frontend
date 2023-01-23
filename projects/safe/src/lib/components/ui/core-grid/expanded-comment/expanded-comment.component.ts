import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Data for the dialog inputs */
interface DialogData {
  title: string;
  value: string;
  readonly?: boolean;
}

/** Component for expanded comments */
@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss'],
})
export class SafeExpandedCommentComponent implements OnInit {
  public formControl!: UntypedFormControl;

  /**
   * Constructor of this component
   *
   * @param dialogRef The reference to the opened dialog
   * @param data The data inputs for the dialog
   * @param fb Angular form builder
   */
  constructor(
    public dialogRef: MatDialogRef<SafeExpandedCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.formControl = this.fb.control({
      value: this.data.value,
      disabled: this.data.readonly,
    });
  }
}
