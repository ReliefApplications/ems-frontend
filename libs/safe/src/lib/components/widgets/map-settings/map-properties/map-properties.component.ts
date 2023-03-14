import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() form!: UntypedFormGroup;

  public mapSettings!: MapConstructorSettings;
  public baseMaps = BASEMAPS;

  /**
   * Map Properties of Map widget.
   */
  constructor() {
    super();
  }

  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    const defaultMapSettings: MapConstructorSettings = {
      basemap: this.form.value.basemap,
      initialState: this.form.get('initialState')?.value,
      timeDimension: this.form.value.timeDimension,
    };
    this.updateMapSettings(defaultMapSettings);
    this.setUpFormListeners();
  }

  /**
   * Set form listeners
   */
  private setUpFormListeners() {
    this.form
      .get('initialState')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          initialState: value,
        } as MapConstructorSettings)
      );
    this.form
      .get('basemap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ basemap: value } as MapConstructorSettings)
      );
    this.form
      .get('timeDimension')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateMapSettings({
          timeDimension: value,
        } as MapConstructorSettings);
      });
  }

  /**
   * Update map settings
   *
   * @param settings new settings
   */
  private updateMapSettings(settings: MapConstructorSettings) {
    if (this.mapSettings) {
      this.mapSettings = {
        ...this.mapSettings,
        ...settings,
      };
    } else {
      this.mapSettings = settings;
    }
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

  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  handleMapEvent(event: MapEvent) {
    switch (event.type) {
      case MapEventType.MOVE_END:
        this.mapSettings.initialState.viewpoint.center.latitude =
          event.content.center.lat;
        this.mapSettings.initialState.viewpoint.center.longitude =
          event.content.center.lng;
        break;
      case MapEventType.ZOOM_END:
        this.mapSettings.initialState.viewpoint.zoom = event.content.zoom;
        this.form
          .get('initialState.viewpoint.zoom')
          ?.setValue(this.mapSettings.initialState.viewpoint.zoom, {
            emitEvent: false,
          });
        break;
      default:
        break;
    }
  }
}
