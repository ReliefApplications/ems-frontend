import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { lastValueFrom, catchError, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { omitBy, isNil } from 'lodash';

/**
 * Shared polygons service
 */
@Injectable({
  providedIn: 'root',
})
export class PolygonsService {
  /** admin0Polygons */
  private _admin0Polygons: any = null;

  /**
   * get admin0Polygons
   *
   * @returns admin0Polygons
   */
  get admin0Polygons(): any {
    return this._admin0Polygons;
  }

  /**
   * set admin0Polygons
   *
   */
  set admin0Polygons(value: any) {
    this._admin0Polygons = value;
  }

  /**
   * Class constructor
   *
   * @param restService RestService
   */
  constructor(private restService: RestService) {}

  /**
   * fetch admin0 polygons
   *
   * @param apiUrl api url
   * @param adminField admin field
   */
  async fetchAdmin0Polygons(apiUrl: string, adminField: string) {
    const params = new HttpParams({
      fromObject: omitBy(
        {
          adminField: adminField,
        },
        isNil
      ),
    });
    this.admin0Polygons = await lastValueFrom(
      this.restService.get(apiUrl, { params }).pipe(catchError(() => of(null)))
    );
  }
}
