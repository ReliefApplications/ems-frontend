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
    console.log('*** getWidgetLayout');
    const dashboardId = this.dashboard.getValue()?.id;
    // if localstorage layout
    const cachedLayout = localStorage.getItem(`widget:${dashboardId}:${id}`);
    console.log(cachedLayout);
    if (cachedLayout) {
      console.log(JSON.parse(cachedLayout));
      return JSON.parse(cachedLayout);
    }
    console.log('HE HO');
    // if no localstorage but default layout
    await this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: dashboardId
      }
    }).valueChanges.subscribe((res) => {
        console.log('res');
        console.log(res);
        if (res.data.dashboard.structure[id].settings.defaultLayout) {
          console.log('IN');
          // if default layout
          console.log('*** IF: res.data.dashboard');
          console.log(res.data.dashboard);
          console.log('*** res.data.dashboard.structure[id].settings.defaultLayout');
          console.log(res.data.dashboard.structure[id].settings.defaultLayout);
          return res.data.dashboard.structure[id].settings.defaultLayout;
        } else {
          // else
          console.log('*** ELSE: res');
          console.log(res);
        }
      },
      (err) => {
        // error
        console.log('ERROR : GET_DASHBOARD_BY_ID');
      }
    );
    // if no localstorage layout and no default layout
    console.log('$$$ THE END $$$');
    return {};
  }

  saveWidgetLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    // const dashboardStructureTemp = this.dashboard.getValue()?.structure;
    // const settingTemp = {...dashboardStructureTemp[id].settings, defaultLayout: layout};
    // const widgetTemp = {...dashboardStructureTemp[id], settings: settingTemp};
    // const structureToSend = [...dashboardStructureTemp];
    // structureToSend[id] = widgetTemp;
    // this.apollo.mutate<EditDashboardMutationResponse>({
    //   mutation: EDIT_DASHBOARD,
    //   variables: {
    //     id: dashboardId,
    //     structure: structureToSend,
    //   }
    // }).subscribe(res => {
    //   console.log('*** res');
    //   console.log(res);
    //   // this.tiles = res.data?.editDashboard.structure;
    //   // this.loading = false;
    // }, error => console.log(error));
    return localStorage.setItem(`widget:${dashboardId}:${id}`, JSON.stringify(layout));
  }

  saveWidgetDefaultLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructureTemp = this.dashboard.getValue()?.structure;
    const settingTemp = {...dashboardStructureTemp[id].settings, defaultLayout: layout};
    const widgetTemp = {...dashboardStructureTemp[id], settings: settingTemp};
    const structureToSend = [...dashboardStructureTemp];
    structureToSend[id] = widgetTemp;
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
