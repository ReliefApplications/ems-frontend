import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { EXPORT_SETTINGS } from '../grid/grid.constants';

/** The data for the dialogs input */
interface DialogData {
  export: {
    records: string;
    fields: string;
    format: string;
    email: boolean;
  };
}

/** Component for exporting data */
@Component({
  selector: 'safe-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class SafeExportComponent implements OnInit {
  // === EXPORT MENU SELECTION ===
  public export = EXPORT_SETTINGS;

  /**
   * Constructor for the component
   *
   * @param data The dialog data
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.export = this.data.export;
  }
}
