import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Layers configuration component of Map Widget.
 */
@Component({
  selector: 'safe-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent implements OnInit {
  @Input() selectedFields: any[] = [];
  @Input() formatedSelectedFields: any[] = [];

  /**
   * Get Online Layers of map as Form Control.
   *
   * @returns Form control
   */
  get onlineLayers(): FormControl {
    return this.form.get('onlineLayers') as FormControl;
  }

  /**
   * Get choropleth layers configuration of map as Form Array.
   *
   * @returns Form Array
   */
  get choropleths(): FormArray {
    return this.form.get('choropleths') as FormArray;
  }

  @Input() form!: FormGroup;

  /**
   * Layers configuration component of Map Widget.
   */
  constructor() {}

  ngOnInit(): void {}
}
