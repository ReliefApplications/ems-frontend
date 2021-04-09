import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'who-tile-display',
  templateUrl: './tile-display.component.html',
  styleUrls: ['./tile-display.component.scss']
})
/*  Modal content to change the display of a widget.
*/
export class WhoTileDisplayComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WhoTileDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      tile: any
    }
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.tileForm = this.formBuilder.group({
      id: this.data.tile.id,
      cols: [this.data.tile.defaultCols, Validators.required],
      rows: [this.data.tile.defaultRows, Validators.required]
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

}
