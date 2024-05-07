import { Inject, Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { BehaviorSubject, first } from 'rxjs';
import { EMPTY_FEATURE_COLLECTION } from '../../components/ui/map/layer';
import set from 'lodash/set';
import { flattenDeep, get, isArray, isNil, isObject, uniq } from 'lodash';
import * as L from 'leaflet';
import REGIONS from './regions';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { LayerDatasourceType } from '../../models/layer.model';
import { simplify } from '@turf/turf';
import { TranslateService } from '@ngx-translate/core';

/** Available admin identifiers */
export type AdminIdentifier =
  | 'admin0.iso2code'
  | 'admin0.iso3code'
  | 'admin0.id';

/** Admin 0 available identifiers */
type Admin0Identifier = 'iso2code' | 'iso3code' | 'id';

type Admin0 = {
  id: number;
  centerlatitude: string;
  centerlongitude: string;
  iso2code: string;
  iso3code: string;
  name: string;
  polygons: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon>;
};

/**
 * Shared map polygons service.
 * Allow to use polygons from common services, and assign them to the layer features.
 */
@Injectable({
  providedIn: 'root',
})
export class MapPolygonsService {
  /** Admin0 polygons */
  public admin0s: Admin0[] = [];
  /** Are admin0 polygons ready */
  private admin0sReady = new BehaviorSubject<boolean>(false);
  /** Admin0 polygons status as observable */
  public admin0sReady$ = this.admin0sReady.asObservable();
  /** Admin0 polygons endpoint url */
  private admin0PolygonsUrl = '';

  /**
   * Shared map polygons service.
   * Allow to use polygons from common services, and assign them to the layer features.
   *
   * @param restService Shared rest service
   * @param translate Angular translate service.
   * @param environment Environment variable
   */
  constructor(
    private restService: RestService,
    private translate: TranslateService,
    @Inject('environment') environment: any
  ) {
    this.admin0PolygonsUrl = environment.admin0PolygonsUrl;

    // On init, fetch the admin0 polygons from the endpoint
    this.getAdmin0Polygons();
  }

  /**
   * Retrieve admin0 polygons
   */
  public getAdmin0Polygons() {
    this.restService.get(this.admin0PolygonsUrl).subscribe((value) => {
      if (value) {
        const mapping = [];
        for (const feature of value.features) {
          // Transform data to fit Admin0 type
          try {
            mapping.push({
              id: feature.id,
              centerlatitude: feature.properties.CENTER_LAT.toString(),
              centerlongitude: feature.properties.CENTER_LON.toString(),
              iso2code: feature.properties.ISO_2_CODE,
              iso3code: feature.properties.ISO_3_CODE,
              name: feature.properties.ADM0_VIZ_NAME,
              // Reduction of the GeoJSON object into a simplified version
              polygons: simplify(feature.geometry, {
                tolerance: 0.1,
                highQuality: true,
                mutate: true,
              }) as Polygon | MultiPolygon | Feature<Polygon | MultiPolygon>,
            });
          } catch (err: any) {
            console.log(
              this.translate.instant(
                'components.widget.settings.map.tooltip.geographicExtent.admin0Error',
                {
                  iso3code: feature.properties.ISO_3_CODE,
                  errorMessage: err.message,
                }
              )
            );
          }
        }
        this.admin0s = mapping;
        this.admin0sReady.next(true);
      }
    });
  }

  /**
   * Assign admin0 polygons to feature layer
   *
   * @param data feature layer
   * @param identifier admin identifier
   * @param layerDatasourceType type of datasource, point or polygon
   * @returns feature layer with polygons for geometry
   */
  public assignAdmin0Geometry(
    data: any,
    identifier: Admin0Identifier = 'iso3code',
    layerDatasourceType: LayerDatasourceType
  ) {
    const geometry = {};
    for (const admin0 of this.admin0s) {
      set(
        geometry,
        admin0[identifier].toString().toLowerCase(),
        layerDatasourceType === 'Polygon'
          ? admin0.polygons
          : {
              type: 'Point',
              coordinates: [admin0.centerlongitude, admin0.centerlatitude],
            }
      );
    }
    const features: any[] = [];
    for (const feature of data.features) {
      const adminIds = uniq(flattenDeep([get(feature, 'geometry')])).filter(
        (x) => !isObject(x) && !isNil(x)
      );
      adminIds.forEach((adminId) => {
        const adminGeometry = get(geometry, adminId.toString().toLowerCase());
        if (adminGeometry) {
          features.push({
            ...feature,
            type: 'Feature',
            geometry: adminGeometry,
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
   * @param layerDatasourceType type of layer datasource, polygon by default
   * @returns feature layer with polygons for geometry
   */
  public assignGeometry(
    data: any,
    identifier: AdminIdentifier = 'admin0.iso3code',
    layerDatasourceType: LayerDatasourceType = 'Polygon'
  ) {
    if (identifier.startsWith('admin0.')) {
      return this.assignAdmin0Geometry(
        data,
        identifier.replace('admin0.', '') as Admin0Identifier,
        layerDatasourceType
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
      const geoJSON: any = {
        type: 'FeatureCollection',
        features: [],
      };
      geographicExtentValue.forEach((x) => {
        switch (x.extent) {
          case 'admin0': {
            if (isArray(x.value)) {
              const admin0s = this.admin0s.filter(
                (data) =>
                  x.value.includes(data.iso2code) ||
                  x.value.includes(data.iso3code) ||
                  x.value.includes(data.name)
              );
              if (admin0s.length > 0) {
                geoJSON.features.push({
                  type: 'FeatureCollection',
                  features: admin0s.map((x: any) => ({
                    type: 'Feature',
                    geometry: x.polygons,
                    properties: {},
                  })),
                });
              }
            } else {
              const admin0 = this.admin0s.find(
                (data) =>
                  data.iso2code === x.value ||
                  data.iso3code === x.value ||
                  data.name === x.value
              );
              if (admin0) {
                geoJSON.features.push({
                  type: 'Feature',
                  geometry: admin0.polygons,
                  properties: {},
                });
              }
            }
            break;
          }
          case 'region': {
            if (isArray(x.value)) {
              const regions = REGIONS.filter((data) =>
                x.value.includes(data.name)
              );
              if (regions.length > 0) {
                geoJSON.features.push({
                  type: 'FeatureCollection',
                  features: regions.map((x) => ({
                    type: 'Feature',
                    geometry: x.geometry,
                    properties: {},
                  })),
                });
              }
            } else {
              const region = REGIONS.find((data) => data.name === x.value);
              if (region) {
                geoJSON.features.push({
                  type: 'Feature',
                  geometry: region.geometry,
                  properties: {},
                });
              }
            }
            break;
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

  /**
   * Find country from latlng
   *
   * @param latlng lat lng point
   * @returns Country ( if any )
   */
  public findCountryFromPoint(latlng: L.LatLng) {
    const point = [latlng.lng, latlng.lat];
    return this.admin0s.find((x) => booleanPointInPolygon(point, x.polygons));
  }
}
