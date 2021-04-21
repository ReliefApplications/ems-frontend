import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss']
})
export class SafeExpandedCommentComponent implements OnInit {

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SafeExpandedCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  newComment: string | undefined = this.data.comment.textComment;

  ngOnInit(): void {}
  onClose(): void {
    this.dialogRef.close({data: this.newComment});
  }
}
