import { Component, OnInit, Input } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'who-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css']
})
export class ConfirmDeleteModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteModalComponent>
  ) {
  }
  @Input() modalText = 'Are you sure you want to delete this component?';
  @Input() cancelText = 'Cancel';
  @Input() deleteText = 'Delete';
  @Input() onDelete;
  ngOnInit(): void {
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
