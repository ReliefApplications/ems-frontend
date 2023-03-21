import { Component, Input, OnInit, SkipSelf } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';
import { MapSettingsService, TabContentTypes } from '../map-settings.service';

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
  @Input() mapSettings!: MapConstructorSettings;
  @Input() arcgisteste!: string;

  public currentTab!: string;
  public baseMaps = BASEMAPS;

  /** @returns the form group for the map controls */
  get controlsFormGroup() {
    return this.form.get('controls') as UntypedFormGroup;
  }

  /**
   * Map Properties of Map widget.
   *
   * @param mapSettingsService MapSettingsService
   */
  constructor(@SkipSelf() private mapSettingsService: MapSettingsService) {
    super();
  }

  ngOnInit(): void {
    this.mapSettingsService.mapSettingsCurrentTabTitle.next(
      'components.widget.settings.map.properties.title'
    );
    this.mapSettingsService.mapSettingsButtons.next([
      {
        value: TabContentTypes.PARAMETERS,
        icon: 'map',
        label: 'components.widget.settings.map.properties.title',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null) {
          return currentTab === this.value;
        },
      },
      {
        value: TabContentTypes.LAYERS,
        icon: 'layers',
        label: 'common.layers',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null) {
          return currentTab === this.value;
        },
      },
    ]);
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
  public handleMapEvent(event: MapEvent) {
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
