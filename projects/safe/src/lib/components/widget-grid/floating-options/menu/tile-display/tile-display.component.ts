import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface of the dialog data.
 */
interface DialogData {
  tile: any;
}

/**
 * Modal content to change the cols / rows of a widget.
 */
@Component({
  selector: 'safe-tile-display',
  templateUrl: './tile-display.component.html',
  styleUrls: ['./tile-display.component.scss']
})
export class SafeTileDisplayComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeTileDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  /**
   * Builds the form.
   */
  ngOnInit(): void {
    this.tileForm = this.formBuilder.group({
      id: this.data.tile.id,
      cols: [this.data.tile.defaultCols, Validators.required],
      rows: [this.data.tile.defaultRows, Validators.required]
    });
  }
}
