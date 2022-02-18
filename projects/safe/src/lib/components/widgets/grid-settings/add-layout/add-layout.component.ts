import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Layout } from '../../../../models/layout.model';
import { SafeLayoutModalComponent } from '../../../layout-modal/layout-modal.component';

interface DialogData {
  layouts: Layout[];
}

/**
 * Add a layout modal.
 * Modal is then added to the grid, and to the related form / resource if new.
 */
@Component({
  selector: 'safe-add-layout',
  templateUrl: './add-layout.component.html',
  styleUrls: ['./add-layout.component.scss'],
})
export class AddLayoutComponent implements OnInit {
  @Input() layouts: Layout[] = [];
  public nextStep = false;

  constructor(
    private dialogRef: MatDialogRef<AddLayoutComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.layouts = data.layouts;
  }

  ngOnInit(): void {}

  /**
   * Opens the panel to create a new layout.
   */
  public onCreate(): void {
    const dialogRef = this.dialog.open(SafeLayoutModalComponent, {
      data: {},
    });
  }

  /**
   * Selects an existing layout.
   *
   * @param choice layout choice.
   */
  public onSelect(choice: MatSelectChange): void {
    this.dialogRef.close(choice.value);
  }
}
