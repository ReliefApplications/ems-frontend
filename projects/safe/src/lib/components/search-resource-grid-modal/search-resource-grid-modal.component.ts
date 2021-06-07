import { ApplicationRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'safe-search-resource-grid-modal',
  templateUrl: './search-resource-grid-modal.component.html',
  styleUrls: ['./search-resource-grid-modal.component.css']
})
export class SafeResourceGridModalComponent implements OnInit {

  public multiSelect = false;
  public gridSettings = {};

  public selectedRows: any [] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      gridSettings: {},
      multiselect: boolean,
      selectedRows: string[]
    },
    public dialogRef: MatDialogRef<SafeResourceGridModalComponent>,
    private ref: ApplicationRef
  ) {
    this.multiSelect = data.multiselect;
    this.gridSettings = {query: this.data.gridSettings};
    if (this.data.selectedRows) {
      this.selectedRows = this.data.selectedRows;
    }
    this.ref.tick();
  }

  ngOnInit(): void {
  }

  onRowSelected(rows: any): void {
    this.selectedRows = rows;
  }

  closeModal(saveChanges: boolean = true): void {
    this.ref.tick();
    if (saveChanges) {
      this.dialogRef.close(this.selectedRows);
    }
  }
}
