import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {
  MapConstructorSettings,
  MapEvent,
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

  private deleteLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerToAdd$ = this.deleteLayer.asObservable();
  private addLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerToDelete$ = this.addLayer.asObservable();
  private overlaysValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public overlaysValue$ = this.overlaysValue.asObservable();

  private centerOfMap: any;
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
    console.log(this.form);
    this.mapSettings = {
      baseMap: this.form.value.basemap,
      zoom: this.form.value.zoom,
      centerLat: this.form.value.centerLat,
      centerLong: this.form.value.centerLong,
    };
    this.form
      .get('zoom')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapSettings = { zoom: value } as MapConstructorSettings;
      });
    this.form
      .get('centerLat')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapSettings = { centerLat: value } as MapConstructorSettings;
      });
    this.form
      .get('centerLong')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapSettings = { centerLong: value } as MapConstructorSettings;
      });
    this.form
      .get('basemap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapSettings = { baseMap: value } as MapConstructorSettings;
      });
  }

  /**
   * Set the latitude and longitude of the center of the map using the one in the preview map.
   */
  onSetByMap(): void {
    this.form
      .get('centerLat')
      ?.setValue(this.centerOfMap.lat, { emitEvent: false });
    this.form
      .get('centerLong')
      ?.setValue(this.centerOfMap.lng, { emitEvent: false });
    this.form
      .get('zoom')
      ?.setValue(this.mapSettings.zoom, { emitEvent: false });
  }

  handleMapEvent(mapEvent: MapEvent) {
    console.log(mapEvent);
    switch (mapEvent.type) {
      case 'moveend':
        this.centerOfMap = mapEvent.content.center;
        break;
      default:
        break;
    }
  }
}
