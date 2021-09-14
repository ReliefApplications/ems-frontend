import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {Apollo} from 'apollo-angular';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../graphql/queries';
import {EDIT_DASHBOARD, EditDashboardMutationResponse} from '../graphql/mutations';

@Injectable({
  providedIn: 'root'
})
export class SafeDashboardService {

  private dashboard = new BehaviorSubject<Dashboard | null>(null);

  get dashboard$(): Observable<Dashboard | null> {
    return this.dashboard.asObservable();
  }

  constructor(private apollo: Apollo) {
    const a = 0;
  }

  openDashboard(dashboard: Dashboard): void {
    this.dashboard.next(dashboard);
  }

  closeDashboard(): void {
    this.dashboard.next(null);
  }

  async getWidgetLayout(id: number): Promise<any> {
    const dashboardId = this.dashboard.getValue()?.id;
    const cachedLayout = localStorage.getItem(`widget:${dashboardId}:${id}`);
    if (cachedLayout) {
      return JSON.parse(cachedLayout);
    }
    let defaultLayout = {};
    await this.apollo.query<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: dashboardId
      }
    }).toPromise().then((res) => {
      if (res.data.dashboard.structure[id].settings.defaultLayout){
        defaultLayout = {...res.data.dashboard.structure[id].settings.defaultLayout};
      }
      else {
        defaultLayout = {};
      }
    });
    return defaultLayout;
  }

  saveWidgetLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    return localStorage.setItem(`widget:${dashboardId}:${id}`, JSON.stringify(layout));
  }

  saveWidgetDefaultLayout(id: number, layout: any): void {
    console.log('defaukt layout changed');
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructureTemp = this.dashboard.getValue()?.structure;
    const settingTemp = {...dashboardStructureTemp[id].settings, defaultLayout: layout};
    const widgetTemp = {...dashboardStructureTemp[id], settings: settingTemp};
    const structureToSend = [...dashboardStructureTemp];
    structureToSend[id] = widgetTemp;
    console.log(structureToSend);
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        structure: structureToSend,
      }
    }).subscribe(res => {
      console.log('*** res');
      console.log(res);
    }, error => console.log(error));
  }
}
