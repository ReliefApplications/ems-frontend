import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { divisionForm } from '../../map-forms';

/** Interface of dialog data of the component */
interface DialogData {
  value: any;
  fields: any[];
  query: any;
}

/**
 * Single choropleth layer configuration component.
 */
@Component({
  selector: 'safe-map-choropleth-division',
  templateUrl: './map-choropleth-division.component.html',
  styleUrls: ['./map-choropleth-division.component.scss'],
})
export class MapChoroplethDivisionComponent implements OnInit {
  public form!: FormGroup;

  public fields: any[] = [];
  public query: any;

  /**
   * Single choropleth layer configuration component.
   *
   * @param data dialog data
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.form = divisionForm(data.value);
    this.fields = data.fields;
    this.query = data.query;
  }

  ngOnInit(): void {}
}
