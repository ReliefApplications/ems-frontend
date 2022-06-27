import { ApplicationRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';

/**
 * Dialog data interface of the component
 */
interface DialogData {
  gridSettings: any;
  multiselect: boolean;
  selectedRows: string[];
  selectable?: boolean;
}

/**
 * Grid of records for resource / resources questions.
 */
@Component({
  selector: 'safe-search-resource-grid-modal',
  templateUrl: './search-resource-grid-modal.component.html',
  styleUrls: ['./search-resource-grid-modal.component.scss'],
})
export class SafeResourceGridModalComponent implements OnInit {
  public multiSelect = false;
  public gridSettings: GridSettings = {};

  public selectedRows: any[] = [];

  /**
   * Is the data selectable
   *
   * @returns is the data selectable
   */
  get selectable(): boolean {
    return this.data.selectable || false;
  }

  /**
   * Grid of records for resource / resources questions.
   *
   * @param data dialog data
   * @param dialogRef Material dialog reference of the component
   * @param ref Application reference
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SafeResourceGridModalComponent>,
    private ref: ApplicationRef
  ) {
    this.multiSelect = this.data.multiselect;
    if (this.data.gridSettings.sort && !this.data.gridSettings.sort.field) {
      delete this.data.gridSettings.sort;
    }
    this.gridSettings = {
      query: this.data.gridSettings,
      actions: {
        delete: false,
        history: true,
        convert: false,
        update: false,
        inlineEdition: false,
      },
    };
    if (this.data.selectedRows) {
      this.selectedRows = [...this.data.selectedRows];
    }
    this.ref.tick();
  }

  ngOnInit(): void {}

  /**
   * Handle selection change in the grid.
   *
   * @param selection selection event
   */
  onSelectionChange(selection: any): void {
    if (this.multiSelect) {
      if (selection.selectedRows.length > 0) {
        this.selectedRows = this.selectedRows.concat(
          selection.selectedRows.map((x: any) => x.dataItem.id)
        );
      }
      if (selection.deselectedRows.length > 0) {
        const deselectedRows = selection.deselectedRows.map(
          (r: any) => r.dataItem.id
        );
        this.selectedRows = this.selectedRows.filter(
          (r: any) => !deselectedRows.includes(r)
        );
      }
    } else {
      this.selectedRows = selection.selectedRows.map((x: any) => x.dataItem.id);
    }
  }

  /**
   * Close the modal, indicating if update is required
   *
   * @param saveChanges is update required
   */
  closeModal(saveChanges: boolean = true): void {
    this.ref.tick();
    if (saveChanges) {
      this.dialogRef.close(this.selectedRows);
    }
  }
}
