import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EXPORT_SETTINGS } from '../grid/grid.constants';

@Component({
  selector: 'safe-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class SafeExportComponent implements OnInit {

  // === EXPORT MENU SELECTION ===
  public export: {
    records: string,
    fields: string,
    format: string
  } = EXPORT_SETTINGS;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    export: {
      records: string,
      fields: string,
      format: string
    }
  }) { }

  ngOnInit(): void {
    this.export = this.data.export
  }
}
