import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'safe-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class SafeModalComponent implements OnInit {
  @Input() closable = false;

  constructor(private dialogRef: MatDialogRef<SafeModalComponent>) {
    this.dialogRef.addPanelClass('fullscreen-dialog');
  }

  ngOnInit(): void {}
}
