import { Component, Inject, QueryList } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ColumnBase } from '@progress/kendo-angular-grid';
import * as _ from 'lodash';

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
  public columns: ColumnBase[];

  /**
   * Column chooser for the grid widget
   *
   * @param data Data provided from the opening of the dialog
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.originalColumns = data.columns;
    this.columns = _.cloneDeep(this.originalColumns.toArray());
    console.log(this.columns);
  }

  /**
   * Resets the columns to their original state
   */
  public reset() {
    this.columns = _.cloneDeep(this.originalColumns.toArray());
  }

  /**
   * Applies visibility changes to the grid
   */
  public apply() {
    //this.originalColumns = this.columns;
  }

  /** Checks all the columns checkboxes */
  public checkAllCheckboxes() {
    this.columns.forEach((column) => {
      column.hidden = false;
    });
    console.log(this.columns.map((column) => column.hidden));
  }

  /** Unchecks all the columns checkboxes */
  public uncheckAllCheckboxes() {
    this.columns.forEach((column) => {
      if (column.title) column.hidden = true;
    });
  }
}
