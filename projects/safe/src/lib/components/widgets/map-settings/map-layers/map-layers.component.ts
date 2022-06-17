import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent implements OnInit {
  get onlineLayers(): FormControl {
    return this.form.get('onlineLayers') as FormControl;
  }

  get clorophlets(): FormArray {
    return this.form.get('clorophlets') as FormArray;
  }

  @Input() form!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
