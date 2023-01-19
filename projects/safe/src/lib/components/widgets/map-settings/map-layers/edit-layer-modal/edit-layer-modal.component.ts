import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createLayerForm } from '../../map-forms';
import { MapLayerI } from '../map-layers.component';

/** Modal for adding and editing map layers */
@Component({
  selector: 'safe-edit-layer-modal',
  templateUrl: './edit-layer-modal.component.html',
  styleUrls: ['./edit-layer-modal.component.scss'],
})
export class SafeEditLayerModalComponent implements OnInit {
  public form: FormGroup;

  /**
   * Modal for adding and editing map layers
   *
   * @param layer Injected map layer, if any
   */
  constructor(@Inject(MAT_DIALOG_DATA) public layer?: MapLayerI) {
    this.form = createLayerForm(layer);
  }

  ngOnInit(): void {}
}
