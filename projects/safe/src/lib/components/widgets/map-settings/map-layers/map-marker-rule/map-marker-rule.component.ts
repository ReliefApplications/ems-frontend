import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { markerRuleForm } from '../../map-forms';

/** Interface of dialog data of the component */
interface DialogData {
  value: any;
  fields: any[];
}

/**
 * Single Marker Rule component.
 * Used in dialog.
 */
@Component({
  selector: 'safe-map-marker-rule',
  templateUrl: './map-marker-rule.component.html',
  styleUrls: ['./map-marker-rule.component.scss'],
})
export class MapMarkerRuleComponent implements OnInit {
  public form!: FormGroup;

  public fields: any[] = [];

  /**
   * Single Marker Rule component.
   *
   * @param data dialog data
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.form = markerRuleForm(data.value);
    this.fields = data.fields;
  }

  ngOnInit(): void {}
}
