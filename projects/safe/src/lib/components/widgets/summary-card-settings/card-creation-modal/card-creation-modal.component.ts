import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * The component is used on a card creation in the summary-card widget
 */
@Component({
  selector: 'safe-card-creation-modal',
  templateUrl: './card-creation-modal.component.html',
  styleUrls: ['./card-creation-modal.component.scss'],
})
export class SafeCardCreationModalComponent implements OnInit {
  public data: any = {
    isDynamic: false,
  };

  /**
   * Constructor for safe-card-creation-modal contructor
   *
   * @param dialogRef
   * @param formBuilder
   */
  constructor(public dialogRef: MatDialogRef<SafeCardCreationModalComponent>) {}

  ngOnInit(): void {}

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending the modal data.
   */
  onCreate(): void {
    this.dialogRef.close(this.data);
  }

  /**
   * Changes the isDynamic property on radio component change
   *
   * @param event dynamic change
   */
  radioChange(event: any): void {
    this.data.isDynamic = event.value;
  }
}
