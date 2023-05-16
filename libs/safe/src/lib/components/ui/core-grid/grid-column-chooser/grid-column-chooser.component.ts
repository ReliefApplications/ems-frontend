import { Component, Inject, QueryList } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { ColumnBase } from '@progress/kendo-angular-grid';

/** Data provided from the opening of the dialog */
interface DialogData {
  columns: QueryList<ColumnBase>;
}

/**
 * Column chooser
 */
@Component({
  selector: 'safe-grid-column-chooser',
  templateUrl: './grid-column-chooser.component.html',
  styleUrls: ['./grid-column-chooser.component.scss'],
})
export class SafeGridColumnChooserComponent {
  private originalColumns: QueryList<ColumnBase>;
  public columns: { title: string; visible: boolean }[];

  /**
   * Column chooser for the grid widget
   *
   * @param data Data provided from the opening of the dialog
   * @param dialogRef Reference to the modal
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<SafeGridColumnChooserComponent>
  ) {
    this.originalColumns = data.columns;
    this.columns = this.originalColumns.toArray().map((column) => {
      return { title: column.title, visible: !column.hidden };
    });
  }

  /**
   * Resets the columns to their original state
   */
  public reset() {
    this.columns = this.originalColumns.toArray().map((column) => {
      return { title: column.title, visible: !column.hidden };
    });
  }

  /**
   * Applies visibility changes to the grid
   */
  public apply() {
    this.originalColumns.toArray().forEach((column, index) => {
      column.hidden = !this.columns[index].visible;
    });
    this.dialogRef.close();
  }

  /** Checks all the columns checkboxes */
  public checkAllCheckboxes() {
    this.columns.forEach((column) => {
      column.visible = true;
    });
  }

  /** Unchecks all the columns checkboxes */
  public uncheckAllCheckboxes() {
    this.columns.forEach((column) => {
      if (column.title) column.visible = false;
    });
  }
}
