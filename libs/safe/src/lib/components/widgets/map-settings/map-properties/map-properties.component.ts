import { Component, Input } from '@angular/core';
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

  public baseMaps = BASEMAPS;

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
      .get('centerLat')
      ?.setValue(this.mapSettings.centerLat, { emitEvent: false });
    this.form
      .get('centerLong')
      ?.setValue(this.mapSettings.centerLong, { emitEvent: false });
    this.form
      .get('zoom')
      ?.setValue(this.mapSettings.zoom, { emitEvent: false });
  }
}
