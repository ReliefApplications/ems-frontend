import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { ColumnBase } from '@progress/kendo-angular-grid';

/**
 * Column chooser
 */
@Component({
  selector: 'safe-grid-column-chooser',
  templateUrl: './grid-column-chooser.component.html',
  styleUrls: ['./grid-column-chooser.component.scss'],
})
export class SafeGridColumnChooserComponent implements OnInit {
  @Input() originalColumns: QueryList<ColumnBase> | undefined;
  @Output() hideColumnChooser = new EventEmitter<boolean>();
  public columns: { title: string; visible: boolean }[] = [];

  /**
   * Column chooser for the grid widget
   */
  ngOnInit() {
    if (this.originalColumns)
      this.columns = this.originalColumns?.toArray().map((column) => {
        return { title: column.title, visible: !column.hidden };
      });
  }

  /**
   * Resets the columns to their original state
   */
  public reset() {
    if (this.originalColumns)
      this.columns = this.originalColumns.toArray().map((column) => {
        return { title: column.title, visible: !column.hidden };
      });
  }

  /**
   * Applies visibility changes to the grid
   */
  public apply() {
    this.originalColumns?.toArray().forEach((column, index) => {
      column.hidden = !this.columns[index].visible;
    });
    this.hideColumnChooser.emit(false);
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
