import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { request } from '@esri/arcgis-rest-request';
import { ApiKey } from '@esri/arcgis-rest-auth';

/**
 * Shared ArcGIS service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeArcGISService {
  private availableLayers = new BehaviorSubject<any[]>([]);
  private selectedLayer = new BehaviorSubject<any>([]);

  public availableLayers$ = this.availableLayers.asObservable();
  public selectedLayer$ = this.selectedLayer.asObservable();

  private authentication: any;

  constructor(@Inject('environment') environment: any) {
    this.authentication = new ApiKey({
      key: environment.esriApiKey,
    });
  }

  /**
   * Searchs through ArcGIS available layers, and returns filtered list.
   *
   * @param search search value
   */
  public searchLayers(searchTerm: string): void {
    if (searchTerm === '') {
      this.availableLayers.next([]);
    } else {
      request(
        'https://www.arcgis.com/sharing/rest/search/suggest?f=pjson&filter=type:"Feature Service"&suggest=' +
          searchTerm,
        {
          authentication: this.authentication,
        }
      ).then((response: any) => {
        this.availableLayers.next(response.results);
      });
    }
  }

  /**
   * Gets layers by its id.
   *
   * @param id layer id.
   */
  public getLayer(id: string): void {
    request(
      'https://www.arcgis.com/sharing/rest/content/items/' + id + '?f=pjson',
      {
        authentication: this.authentication,
      }
    ).then((response: any) => {
      if (response) {
        this.selectedLayer.next(response);
      }
    });
  }

  /**
   * Clears current selected layer.
   */
  public clearSelectedLayer(): void {
    this.selectedLayer.next([]);
  }
}
