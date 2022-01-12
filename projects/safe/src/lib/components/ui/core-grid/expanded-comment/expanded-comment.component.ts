import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title: string;
  comment: string;
  readonly?: boolean;
}

@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss'],
})
export class SafeExpandedCommentComponent implements OnInit {
  public comment = '';

  constructor(
    public dialogRef: MatDialogRef<SafeExpandedCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.comment = this.data.comment;
  }
}
