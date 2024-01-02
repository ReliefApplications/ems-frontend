import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { set } from 'lodash';
import { parse } from 'wellknown';

/** Admin 0 available identifiers */
type Admin0Identifier = 'iso2code' | 'iso3code' | 'id';

/**
 * Shared polygons service
 */
@Injectable({
  providedIn: 'root',
})
export class PolygonsService {
  private admin0Polygons: any;

  constructor(private http: HttpClient) {}

  async fetchAdmin0Data(): Promise<void> {
    this.admin0Polygons = [];
  }

  getAdmin0Polygons(identifier: Admin0Identifier = 'iso3code'): any {
    const mapping = {};
    for (const country of this.admin0Polygons) {
      if (country.polygons && country[identifier]) {
        // Assuming 'set' and 'parse' functions are defined elsewhere
        set(
          mapping,
          country[identifier].toLowerCase(),
          parse(country.polygons)
        );
      }
    }
    return mapping;
  }
}
