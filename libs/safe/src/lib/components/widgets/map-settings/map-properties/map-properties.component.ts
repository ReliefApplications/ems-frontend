import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapConstructorSettings } from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent extends SafeUnsubscribeComponent {
  @Input() form!: UntypedFormGroup;
  @Input() mapSettings!: MapConstructorSettings;
  @Input() arcgisteste!: string;

  public baseMaps = BASEMAPS;

  /** @returns the form group for the map controls */
  get controlsFormGroup() {
    return this.form.get('controls') as UntypedFormGroup;
  }
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  /**
   * Map Properties of Map widget.
   */
  constructor() {
    super();
  }

  /**
   * Set the latitude and longitude of the center of the map using the one in the preview map.
   */
  onSetByMap(): void {
    this.form
      .get('initialState.viewpoint')
      ?.setValue(this.mapSettings.initialState.viewpoint, {
        emitEvent: false,
      });
  }
}
