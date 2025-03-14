import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { BehaviorSubject, first } from 'rxjs';
import { EMPTY_FEATURE_COLLECTION } from '../../components/ui/map/layer';
import set from 'lodash/set';
import { flattenDeep, get, isArray, isNil, isObject, uniq } from 'lodash';
import * as L from 'leaflet';
import { FeatureCollection } from 'geojson';

/** Available admin identifiers */
type AdminIdentifier = 'admin0.iso2' | 'admin0.iso3' | 'admin0.id';

/** Admin 0 available identifiers */
type Admin0Identifier = 'iso2' | 'iso3' | 'id';

/**
 * Shared map polygons service.
 * Allow to use polygons from common services, and assign them to the layer features.
 */
@Injectable({
  providedIn: 'root',
})
export class MapPolygonsService {
  /** Admin0 polygons */
  public admin0s: {
    id: string;
    iso2: string;
    iso3: string;
    title_en: string;
    title_fr: string;
    title_es: string;
    title_ar: string;
    title_ru: string;
    title_zh: string;
    electoral_group: string;
    regional_group: string;
    membership: string;
    date_first_admission: Date;
    date_departure: Date;
    capital_en: string;
    capital_fr: string;
    capital_es: string;
    capital_ar: string;
    capital_ru: string;
    capital_zh: string;
    createdAt: Date;
    updatedAt: Date;
    ldc: boolean;
    lldc: boolean;
    sids: boolean;
    coordinates: FeatureCollection;
    geometry: FeatureCollection;
    uuid: string;
  }[] = [];
  /** Are admin0 polygons ready */
  private admin0sReady = new BehaviorSubject<boolean>(false);
  /** Admin0 polygons status as observable */
  public admin0sReady$ = this.admin0sReady.asObservable();

  /**
   * Shared map polygons service.
   * Allow to use polygons from common services, and assign them to the layer features.
   *
   * @param restService Shared rest service
   */
  constructor(private restService: RestService) {
    // On init, fetch the admin0 polygons from the back-end
    // The back-end handles the caching of polygons & reduction
    this.getAdmin0Polygons();
  }

  /**
   * Retrieve admin0 polygons
   */
  public getAdmin0Polygons() {
    this.restService
      .get(`${this.restService.apiUrl}/gis/admin0`)
      .subscribe((value) => {
        if (value) {
          this.admin0s = value;
          this.admin0sReady.next(true);
        }
      });
  }

  /**
   * Assign admin0 polygons to feature layer
   *
   * @param data feature layer
   * @param identifier admin identifier
   * @returns feature layer with polygons for geometry
   */
  public assignAdmin0Polygons(
    data: any,
    identifier: Admin0Identifier = 'iso3'
  ) {
    const polygons = {};
    for (const admin0 of this.admin0s) {
      set(polygons, admin0[identifier].toLowerCase(), admin0.geometry);
    }
    const features: any[] = [];
    for (const feature of data.features) {
      const adminIds = uniq(flattenDeep([get(feature, 'geometry')])).filter(
        (x) => !isObject(x) && !isNil(x)
      );
      adminIds.forEach((adminId) => {
        const adminPolygons = get(polygons, adminId.toString().toLowerCase());
        if (adminPolygons) {
          features.push({
            ...feature,
            type: 'Feature',
            geometry: adminPolygons,
          });
        }
      });
    }
    return {
      type: 'FeatureCollection',
      features,
    };
  }

  /**
   * Assign polygons to feature layer
   *
   * @param data feature layer
   * @param identifier admin identifier
   * @returns feature layer with polygons for geometry
   */
  public assignPolygons(
    data: any,
    identifier: AdminIdentifier = 'admin0.iso3'
  ) {
    if (identifier.startsWith('admin0.')) {
      return this.assignAdmin0Polygons(
        data,
        identifier.replace('admin0.', '') as Admin0Identifier
      );
    } else {
      return EMPTY_FEATURE_COLLECTION;
    }
  }

  /**
   * Fit bounds & zoom on country
   *
   * @param geographicExtentValue geographic extent value
   * @param map leaflet map
   */
  public zoomOn(
    geographicExtentValue: { extent: string; value: string | string[] }[],
    map: L.Map
  ): void {
    this.admin0sReady$.pipe(first((v) => v)).subscribe(() => {
      // let layer: L.GeoJSON | undefined = undefined;
      const geoJSON: FeatureCollection | FeatureCollection[] = {
        type: 'FeatureCollection',
        features: [],
      };
      geographicExtentValue.forEach((x) => {
        switch (x.extent) {
          case 'admin0': {
            if (isArray(x.value)) {
              const admin0s = this.admin0s.filter(
                (data) =>
                  x.value.includes(data.iso2) ||
                  x.value.includes(data.iso3) ||
                  x.value.includes(data.title_en)
              );
              if (admin0s.length > 0) {
                geoJSON.features = geoJSON.features.concat(
                  admin0s.flatMap((x) => x.geometry.features)
                );
              }
            } else {
              const admin0 = this.admin0s.find(
                (data) =>
                  data.iso2 === x.value ||
                  data.iso3 === x.value ||
                  data.title_en === x.value
              );
              if (admin0) {
                geoJSON.features = geoJSON.features.concat(
                  admin0.geometry.features
                );
              }
            }
            break;
          }
          case 'region': {
            // if (isArray(x.value)) {
            //   const regions = REGIONS.filter((data) =>
            //     x.value.includes(data.name)
            //   );
            //   if (regions.length > 0) {
            //     geoJSON.features.push({
            //       type: 'FeatureCollection',
            //       features: regions.map((x) => ({
            //         type: 'Feature',
            //         geometry: x.geometry,
            //         properties: {},
            //       })),
            //     });
            //     regions.flatMap((x) => x.geometry.features);
            //   }
            // } else {
            //   const region = REGIONS.find((data) => data.name === x.value);
            //   if (region) {
            //     geoJSON.features.push({
            //       type: 'Feature',
            //       geometry: region.geometry as Polygon,
            //       properties: {},
            //     });
            //   }
            // }
            // break;
          }
        }
      });

      if (geoJSON.features.length > 0) {
        // Timeout seems to be needed for first load of the map.
        setTimeout(() => {
          map.fitBounds(L.geoJSON(geoJSON).getBounds());
        }, 500);
      }
    });
  }
}
