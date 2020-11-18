import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}

@Component({
  selector: 'who-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class WhoConfirmModalComponent implements OnInit {

  public title = 'Confirm';
  public content: string;
  public cancelText = 'Cancel';
  public confirmText = 'Confirm';
  public confirmColor = 'primary';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if ( data.title ) { this.title = data.title; }
    if ( data.content ) { this.content = data.content; }
    if ( data.cancelText ) { this.cancelText = data.cancelText; }
    if ( data.confirmText ) { this.confirmText = data.confirmText; }
    if ( data.confirmColor ) { this.confirmColor = data.confirmColor; }
  }

  ngOnInit(): void {
  }
}
