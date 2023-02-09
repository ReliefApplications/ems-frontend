import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FA_ICONS } from '../../../../map/const/fa-icons';
import { LAYER_TYPES } from '../../map-layers.component';

/** Component for the layer styling */
@Component({
  selector: 'safe-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss'],
})
export class LayerStylingComponent implements OnInit {
  @Input() form!: UntypedFormGroup;

  /** @returns Style from group */
  get styleForm(): any {
    return this.form.get('style');
  }

  public availableIcons = ['leaflet_default', ...FA_ICONS];
  public primaryColor: string;

  /** @returns the layer type */
  get layerType(): typeof LAYER_TYPES[number] {
    return this.form.get('type')?.value;
  }

  /**
   * Component for the layer styling
   *
   * @param environment platform environment
   */
  constructor(@Inject('environment') environment: any) {
    this.primaryColor = environment.theme.primary;
  }

  ngOnInit(): void {
    const disableIfDefault = (value: string) => {
      if (value === 'leaflet_default') {
        this.styleForm.get('color').disable();
        this.styleForm.get('size').disable();
      } else {
        this.styleForm.get('color').enable();
        this.styleForm.get('size').enable();
      }
    };
    disableIfDefault(this.styleForm.get('icon')?.value);
    this.styleForm.get('icon')?.valueChanges.subscribe(disableIfDefault);
  }
}
