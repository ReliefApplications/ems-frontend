import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MapConstructorSettings } from '../ui/map/interfaces/map.interface';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { MapComponent, MapModule } from '../ui/map';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import area from '@turf/area';
import { intersect } from '@turf/intersect';
import { union } from '@turf/union';
import { difference } from '@turf/difference';
import { convex } from '@turf/convex';
import { featureCollection } from '@turf/helpers';
import { booleanDisjoint } from '@turf/boolean-disjoint';
import { MapLayersService } from '../../services/map/map-layers.service';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { AlertModule } from '@oort-front/ui';
import { CommonModule } from '@angular/common';
import Color from 'color';

export type ErrorType = { intersection: boolean; gaps: boolean };
/** Error messages associated to errors */
export const ERROR_MESSAGES: { [key in keyof ErrorType]: string } = {
  intersection: 'There should be no intersection between your three polygons',
  gaps: 'There should be no gaps between your three polygons',
};

/** shapefile map component */
@Component({
  selector: 'shared-shapefile-map',
  templateUrl: './shapefile-map.component.html',
  styleUrls: ['./shapefile-map.component.scss'],
  standalone: true,
  imports: [MapModule, AlertModule, CommonModule],
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
  public shapefile?: FeatureCollection<Polygon | MultiPolygon>;
  /** errors */
  public errors = new BehaviorSubject<ErrorType>({
    intersection: false,
    gaps: false,
  });
  /**
   * Map component
   */
  @ViewChild(MapComponent) mapComponent?: MapComponent;

  /**
   * Whether there are some errors
   *
   * @returns whether there is an error
   */
  get hasErrors() {
    return Object.values(this.errors.value).some((value) => value);
  }

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
    const map = this.mapComponent?.map;
    if (!this.shapefile || !map) {
      return;
    }
    const errors: ErrorType = { intersection: false, gaps: false };
    // Check for overlaps and gaps
    const overlaps = [];
    const { features } = this.shapefile;

    // Iterate through each pair of polygons
    for (let i = 0; i < features.length; i++) {
      const polygonA = features[i];
      const others = union(
        featureCollection(
          features.filter(
            (f) => f.properties?.Zonation !== polygonA.properties?.Zonation
          )
        )
      ); // Check for gaps
      if (others && booleanDisjoint(polygonA, others)) {
        console.log(polygonA.properties?.Zonation);
        errors.gaps = true;
      }
      for (let j = i + 1; j < features.length; j++) {
        const polygonB = features[j];
        const polygons = featureCollection([polygonA, polygonB]);

        // Check for intersection (overlap)
        const intersection = intersect(polygons);
        if (intersection) {
          console.log(intersection, area(intersection));
          overlaps.push(intersection);
        }
      }
    }

    // Display overlaps and gaps on the map
    const addLayerToMap = (
      geoJsonData: FeatureCollection,
      color: string,
      legendTitle: string
    ) => {
      const fillOpacity = 0.1;
      const layer = L.geoJSON(geoJsonData, {
        style: { color, fillOpacity },
      }).addTo(map);
      const div = L.DomUtil.create('div');
      const chien = Color(color).alpha(fillOpacity).rgb().string();
      div.innerHTML = `<div class="flex items-center">
                          <i class="w-6 h-4 border" 
                            style="background:${chien}; border-color:${color}"></i>
                          <span class="ml-2">${legendTitle}</span>
                        </div>
                      `;
      const legend = div.outerHTML;
      (map as any).legendControl.addLayer(layer, legend);
    };

    const overlapsLayer =
      overlaps.length > 2
        ? [
            union(featureCollection(overlaps)) as Feature<
              Polygon | MultiPolygon
            >,
          ]
        : overlaps;

    if (overlapsLayer) {
      addLayerToMap(
        featureCollection(overlapsLayer),
        '#ff0000',
        'Intersections'
      );
      errors.intersection = true;
    }

    if (errors.gaps) {
      const convexHull = convex(this.shapefile, { concavity: 1 });
      const merged = union(
        featureCollection(
          this.shapefile.features.map(
            (f) => convex(f) as Feature<Polygon | MultiPolygon>
          )
        )
      );
      if (merged && convexHull) {
        const gap = difference(featureCollection([convexHull, merged]));
        console.log(gap);
        if (gap) {
          addLayerToMap(featureCollection([gap]), '#000000', 'Gaps');
        }
      }
    }

    // Check for sliver polygons (small area artifacts)
    const minSliverArea = 100;
    const polygonArea = area(this.shapefile);
    if (polygonArea < minSliverArea) {
      console.error(
        `⚠️ Sliver polygon detected in zone (area: ${polygonArea.toFixed(
          2
        )} m²)`
      );
    }

    // const detectSliver = (polygon: Feature<Polygon>) => {
    //   const rings = polygon.geometry.coordinates;
    //   const sliverRings = [];

    //   rings.forEach((ring) => {
    //     const chien = area([ring]);
    //     const perimeter = length([ring], {
    //       units: 'meters',
    //     });

    //     // Define a threshold for slivers (e.g., perimeter-to-area ratio > 10)
    //     const ratio = perimeter / chien;
    //     if (ratio > 10) {
    //       sliverRings.push({ ring, chien, perimeter, ratio });
    //     }
    //   });
    // };

    this.errors.next(errors);
  }
}
