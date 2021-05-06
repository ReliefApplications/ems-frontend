import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss']
})
export class SafeExpandedCommentComponent implements OnInit {

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  public comment = '';

  constructor(
    public dialogRef: MatDialogRef<SafeExpandedCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      comment: string
    }
  ) { }

  ngOnInit(): void {
    this.comment = this.data.comment;
  }

  // onClose(): void {
  //   this.dialogRef.close({data: this.comment});
  // }
}
