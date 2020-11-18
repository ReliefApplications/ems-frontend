import { Component, OnInit, Input } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'who-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class WhoConfirmModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WhoConfirmModalComponent>
  ) {
  }
  @Input() modalText = 'Do you confirm?';
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close();
  }
}
