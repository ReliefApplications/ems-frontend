import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import isNil from 'lodash/isNil';

/** Data for the dialog inputs */
interface DialogData {
  title: string;
  value: string;
  readonly?: boolean;
}

/** Component for expanded comments */
@Component({
  selector: 'shared-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss'],
})
export class ExpandedCommentComponent {
  /** Form control for the input */
  public formControl = new FormControl({
    value: this.data.value,
    disabled: isNil(this.data.readonly) ? true : this.data.readonly,
  });

  /**
   * Constructor of the expanded comment component
   *
   * @param dialogRef The reference to the opened dialog
   * @param data The data inputs for the dialog
   */
  constructor(
    public dialogRef: DialogRef<ExpandedCommentComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}
}
