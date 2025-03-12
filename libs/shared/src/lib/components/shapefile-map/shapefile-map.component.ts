import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MapConstructorSettings } from '../ui/map/interfaces/map.interface';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { MapComponent, MapModule } from '../ui/map';
import { FeatureCollection } from 'geojson';
import area from '@turf/area';
import { intersect } from '@turf/intersect';
import { MapLayersService } from '../../services/map/map-layers.service';

/** shapefile map component */
@Component({
  selector: 'shared-shapefile-map',
  templateUrl: './shapefile-map.component.html',
  styleUrls: ['./shapefile-map.component.scss'],
  standalone: true,
  imports: [MapModule],
})
export class ShapeFileMapComponent
  extends UnsubscribeComponent
  implements AfterViewInit
{
  // === MAP ===
  /**
   * Map settings
   */
  public mapSettings: MapConstructorSettings = {
    initialState: {
      viewpoint: {
        center: {
          latitude: 0,
          longitude: 0,
        },
        zoom: 2,
      },
    },
    worldCopyJump: true,
    controls: {
      download: false,
      legend: true,
      measure: false,
      layer: false,
      search: false,
      lastUpdate: null,
    },
    zoomControl: true,
    basemap: 'Unesco',
  };
  /** layer to add to the map */
  public shapefile?: FeatureCollection;

  /**
   * Map component
   */
  @ViewChild(MapComponent) mapComponent?: MapComponent;

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   *
   * @param mapLayersService Shared map layers service
   */
  constructor(private mapLayersService: MapLayersService) {
    super();
  }

  ngAfterViewInit() {
    if (!this.mapComponent || !this.shapefile) {
      return;
    }
    this.mapLayersService.createShapefileLayer(
      this.mapComponent.map,
      this.shapefile
    );
    this.checkGeoJSONIssues();
  }

  /**
   * Checks whether the geoJSON has some issues
   *
   *
   */
  private checkGeoJSONIssues() {
    //@TODO finish this
    if (!this.shapefile) {
      return;
    }
    // Check for overlaps
    const intersection = intersect(this.shapefile as any);
    if (intersection) {
      console.error(`❌ Overlap detected between zones`, intersection);
    }

    // Check for sliver polygons (small area artifacts)
    const minSliverArea = 100;
    const polygonArea = area(this.shapefile as any);
    if (polygonArea < minSliverArea) {
      console.error(
        `⚠️ Sliver polygon detected in zone (area: ${polygonArea.toFixed(
          2
        )} m²)`
      );
    }

    // TODO: Implement gap detection (requires reference boundary for validation)
  }
}
