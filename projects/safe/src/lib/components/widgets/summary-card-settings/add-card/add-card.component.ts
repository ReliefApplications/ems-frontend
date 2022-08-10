import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * The component is used on a card creation in the summary-card widget
 */
@Component({
  selector: 'safe-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class SafeAddCardComponent implements OnInit {
  @Input() isDynamic: any;

  /**
   * Constructor for safe-add-card contructor
   *
   * @param dialogRef material dialog reference of the component
   * @param data the data passed into the dialog
   * @param data.isDynamic wether the added card will be dynamic or not
   */
  constructor(
    public dialogRef: MatDialogRef<SafeAddCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isDynamic: any }
  ) {}

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
}
