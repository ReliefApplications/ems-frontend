import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent implements OnInit {
  get onlineLayers(): FormControl {
    return this.form.get('onlineLayers') as FormControl;
  }

  @Input() form!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
