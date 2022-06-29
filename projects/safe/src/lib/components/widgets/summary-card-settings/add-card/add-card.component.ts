import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * The component is used on a card creation in the summary-card widget
 */
@Component({
  selector: 'safe-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class SafeAddCardComponent implements OnInit {
  public data: any = {
    isDynamic: false,
  };

  /**
   * Constructor for safe-add-card contructor
   *
   * @param dialogRef material dialog reference of the component
   */
  constructor(public dialogRef: MatDialogRef<SafeAddCardComponent>) {}

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
