import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

declare let arcgisRest: any;

@Injectable({
  providedIn: 'root'
})
export class SafeArcGISService {

  private suggestionsSource = new BehaviorSubject<any[]>([]);
  private currentItemSource = new BehaviorSubject<any>([]);

  public suggestions$ = this.suggestionsSource.asObservable();
  public currentItem$ = this.currentItemSource.asObservable();

  private apikey = 'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg';
  private authentication: any;

  constructor() {
    this.authentication = new arcgisRest.ApiKey({
      key: this.apikey
    });
  }

  public getSuggestions(searchTerm: string): void
  {
    arcgisRest.request('https://www.arcgis.com/sharing/rest/search/suggest?f=pjson&filter=type:"Feature Service"&suggest=' + searchTerm, {
      authentication: this.authentication
    })
      .then((response: any) => {
        this.suggestionsSource.next(response.results);
      });
  }

  public clearSuggestions(): void
  {
    this.suggestionsSource.next([]);
  }

  public getItem(id: string): void
  {
    arcgisRest.request('https://www.arcgis.com/sharing/rest/content/items/' + id + '?f=pjson', {
      authentication: this.authentication
    })
      .then((response: any) => {
        if (response) {
          console.log(response);
          this.currentItemSource.next(response);
        }
      });
  }

  public clearItem(): void
  {
    this.currentItemSource.next([]);
  }
}
