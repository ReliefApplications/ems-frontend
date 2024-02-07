import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { BehaviorSubject, first } from 'rxjs';
import { EMPTY_FEATURE_COLLECTION } from '../../components/ui/map/layer';
import set from 'lodash/set';
import { flattenDeep, get, isNil, isObject, uniq } from 'lodash';
import * as L from 'leaflet';

/** Available admin identifiers */
type AdminIdentifier = 'admin0.iso2code' | 'admin0.iso3code' | 'admin0.id';

/** Admin 0 available identifiers */
type Admin0Identifier = 'iso2code' | 'iso3code' | 'id';

/**
 * Shared map polygons service.
 * Allow to use polygons from common services, and assign them to the layer features.
 */
@Injectable({
  providedIn: 'root',
})
export class MapPolygonsService {
  /** Admin0 polygons */
  public admin0s: any[] = [];
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
    identifier: Admin0Identifier = 'iso3code'
  ) {
    const polygons = {};
    for (const admin0 of this.admin0s) {
      set(polygons, admin0[identifier].toLowerCase(), admin0.polygons);
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
    identifier: AdminIdentifier = 'admin0.iso3code'
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
   * @param geographicExtent geographic extent (admin0)
   * @param map leaflet map
   */
  public zoomOn(
    geographicExtentValue: string,
    geographicExtent: string,
    map: L.Map
  ): void {
    // Only admin0 is available so far
    if (geographicExtent === 'admin0') {
      this.admin0sReady$.pipe(first((v) => v)).subscribe(() => {
        const admin0 = this.admin0s.find(
          (data) =>
            data.iso2code === geographicExtentValue ||
            data.iso3code === geographicExtentValue ||
            data.name === geographicExtentValue
        );
        if (admin0) {
          const layer = L.geoJSON({
            type: 'Feature',
            geometry: admin0.polygons,
            properties: {},
          } as any);
          // Timeout seems to be needed for first load of the map.
          setTimeout(() => {
            map.fitBounds(layer.getBounds());
          }, 500);
        }
      });
    }
  }
}
