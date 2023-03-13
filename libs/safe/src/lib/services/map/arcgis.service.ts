import { Inject, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { ApiKeyManager } from '@esri/arcgis-rest-request';
import {
  getItemData,
  ISearchOptions,
  searchItems,
  SearchQueryBuilder,
} from '@esri/arcgis-rest-portal';

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ArcgisService {
  private session!: ApiKeyManager;

  /**
   *
   * @param environment
   */
  constructor(@Inject('environment') environment: any) {
    this.session = new ApiKeyManager({ key: environment.esriApiKey });
  }

  /**
   *
   * @param map
   * @param id
   */
  public loadWebMap(map: L.Map, id: string): void {
    console.log(this.session);
    getItemData(id, {
      authentication: this.session,
    }).then(async (webMap: any) => {
      console.log(webMap);
    });
  }

  /**
   *
   */
  //private loadBaseMap(): void {}

  /**
   *
   */
  //private loadOperationalLayers(): void {}

  /**
   *
   * @param options
   * @param options.start
   */
  public searchItems(options: { start?: number }) {
    // console.log(this.session);
    const filter: ISearchOptions = {
      q: new SearchQueryBuilder()
        .match('Web Map')
        .in('type')
        .and() // to search all web maps, just remove following 3 lines
        //.match('org')
        .in('access'),
      start: options.start,
      authentication: this.session,
      // portal: arcgisUrl + '/sharing/rest',
    };
    console.log('ABC');
    console.log(searchItems(filter));
    return searchItems(filter);
  }
}

// private availableLayers = new BehaviorSubject<any[]>([]);
// private selectedLayer = new BehaviorSubject<any>([]);

// public availableLayers$ = this.availableLayers.asObservable();
// public selectedLayer$ = this.selectedLayer.asObservable();

// private authentication: any;

// /**
//  * Shared ArcGIS service
//  *
//  * @param environment injected environment configuration
//  */
// constructor(@Inject('environment') environment: any) {
//   this.authentication = new ApiKey({
//     key: environment.esriApiKey,
//   });
// }

// /**
//  * Search through ArcGIS available layers, and returns filtered list.
//  *
//  * @param searchTerm search value
//  */
// public searchLayers(searchTerm: string): void {
//   if (searchTerm === '') {
//     this.availableLayers.next([]);
//   } else {
//     request(
//       'https://www.arcgis.com/sharing/rest/search/suggest?f=pjson&filter=type:"Feature Service"&suggest=' +
//         searchTerm,
//       {
//         authentication: this.authentication,
//       }
//     ).then((response: any) => {
//       this.availableLayers.next(response.results);
//     });
//   }
// }

// /**
//  * Gets layers by its id.
//  *
//  * @param id layer id.
//  */
// public getLayer(id: string): void {
//   request(
//     'https://www.arcgis.com/sharing/rest/content/items/' + id + '?f=pjson',
//     {
//       authentication: this.authentication,
//     }
//   ).then((response: any) => {
//     if (response) {
//       this.selectedLayer.next(response);
//     }
//   });
// }

// /**
//  * Clears current selected layer.
//  */
// public clearSelectedLayer(): void {
//   this.selectedLayer.next([]);
// }
