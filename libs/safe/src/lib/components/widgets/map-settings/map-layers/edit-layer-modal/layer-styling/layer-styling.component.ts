import { Component, Inject, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FA_ICONS } from '../../../../../ui/map/const/fa-icons';
import { LAYER_TYPES } from '../../map-layers.component';

/** Component for the layer styling */
@Component({
  selector: 'safe-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss'],
})
export class LayerStylingComponent {
  @Input() form!: UntypedFormGroup;

  /** @returns Style from group */
  get styleForm(): any {
    return this.form.get('style');
  }

  public availableIcons = ['leaflet_default', ...FA_ICONS];
  public primaryColor: string;
  private layerTypeTranslation = 'components.widget.settings.map.layers.types';
  public selectedLayerTypeTranslation!: string;

  /** @returns the layer type */
  get layerType(): (typeof LAYER_TYPES)[number] {
    this.updateLayerTypeTranslations(this.form.get('type')?.value);
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

  /**
   * Updates layer type translations with the given layer type
   *
   * @param layerType Layer type value to update translations
   */
  private updateLayerTypeTranslations(layerType: string) {
    this.selectedLayerTypeTranslation = `${this.layerTypeTranslation}.${layerType}`;
  }
}
