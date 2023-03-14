import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';
import { ArcgisService } from '../../../../../lib/services/map/arcgis.service';
import { MatSelect } from '@angular/material/select';

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

  public items: any[] = [];

  private start = 1;
  private loading = true;
  private nextPage = true;

  @Output()
  selectionChange = new EventEmitter<string>();

  @ViewChild('arcGisWebMap') elementSelect?: MatSelect;

  /**
   * Map Properties of Map widget.
   *
   * @param arcgis service
   */
  constructor(private arcgis: ArcgisService) {
    super();
  }

  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    const defaultMapSettings = {
      basemap: this.form.value.basemap,
      zoom: this.form.value.zoom,
      centerLat: this.form.value.centerLat,
      centerLong: this.form.value.centerLong,
      timeDimension: this.form.value.timeDimension,
      arcGisWebMap: this.form.value.arcGisWebMap,
    };
    this.updateMapSettings(defaultMapSettings);
    this.setUpFormListeners();
    this.search();
  }

  /**
   * Search for webmap data in argcis-rest-request using arcgis service
   */
  private search(): void {
    this.arcgis.searchItems({ start: this.start }).then((search) => {
      if (search.nextStart > this.start) {
        this.start = search.nextStart;
      } else {
        this.nextPage = false;
      }
      this.items = this.items.concat(search.results);
      this.loading = false;
    });
  }

  /**
   * Deals with open change
   *
   * @param event handler
   */
  openedChange(event: any): void {
    if (event && this.elementSelect) {
      const panel = this.elementSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Load on Scroll
   * 
   * @param event handler
   */
  private loadOnScroll(event: any): void {
    if (
      event.target.scrollHeight -
        (event.target.clientHeight + event.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.nextPage) {
        this.loading = true;
        this.search();
      }
    }
  }

  /**
   * Set form listeners
   */
  private setUpFormListeners() {
    this.form
      .get('zoom')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ zoom: value } as MapConstructorSettings)
      );
    this.form
      .get('centerLat')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ centerLat: value } as MapConstructorSettings)
      );
    this.form
      .get('centerLong')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ centerLong: value } as MapConstructorSettings)
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
    this.form
      .get('arcGisWebMap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          arcGisWebMap: value,
        } as MapConstructorSettings)
      );
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
      .get('centerLat')
      ?.setValue(this.mapSettings.centerLat, { emitEvent: false });
    this.form
      .get('centerLong')
      ?.setValue(this.mapSettings.centerLong, { emitEvent: false });
    this.form
      .get('zoom')
      ?.setValue(this.mapSettings.zoom, { emitEvent: false });
  }

  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  handleMapEvent(event: MapEvent) {
    switch (event.type) {
      case MapEventType.MOVE_END:
        this.mapSettings.centerLat = event.content.center.lat;
        this.mapSettings.centerLong = event.content.center.lng;
        break;
      case MapEventType.ZOOM_END:
        this.mapSettings.zoom = event.content.zoom;
        this.form
          .get('zoom')
          ?.setValue(this.mapSettings.zoom, { emitEvent: false });
        break;
      default:
        break;
    }
  }
}
