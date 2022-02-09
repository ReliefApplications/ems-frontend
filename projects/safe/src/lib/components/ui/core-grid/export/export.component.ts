import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EXPORT_SETTINGS } from '../grid/grid.constants';

interface DialogData {
  export: {
    records: string;
    fields: string;
    format: string;
  };
}

@Component({
  selector: 'safe-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class SafeExportComponent implements OnInit {
  // === EXPORT MENU SELECTION ===
  public export = EXPORT_SETTINGS;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.export = this.data.export;
  }
}
