import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Data for the dialog inputs */
interface DialogData {
  title: string;
  comment: string;
  readonly?: boolean;
}

/** Component for expanded comments */
@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss'],
})
export class SafeExpandedCommentComponent implements OnInit {
  public comment = '';

  /**
   * Constructor of this component
   *
   * @param dialogRef The reference to the opened dialog
   * @param data The data inputs for the dialog
   */
  constructor(
    public dialogRef: MatDialogRef<SafeExpandedCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.comment = this.data.comment;
  }
}
