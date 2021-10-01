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

  getWidgetLayout(widget: any): any {
    const defaultLayout = JSON.parse(JSON.stringify(widget.settings.defaultLayout || {}));
    const defaultDate = new Date(defaultLayout.timestamp || null);
    const dashboardId = this.dashboard.getValue()?.id;
    const cachedLayout = JSON.parse(localStorage.getItem(`widget:${dashboardId}:${widget.id}`) || JSON.stringify({}));
    const cachedDate = new Date(cachedLayout.timestamp || null);
    if (defaultDate > cachedDate) {
      return defaultLayout;
    } else {
      return cachedLayout;
    }
  }

  saveWidgetLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    return localStorage.setItem(`widget:${dashboardId}:${id}`, JSON.stringify({ ...layout, timestamp: + new Date() }));
  }

  saveWidgetDefaultLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructure = this.dashboard.getValue()?.structure;
    const widgetTemp = {
      ...dashboardStructure[id],
      settings: {
        ...dashboardStructure[id].settings,
        defaultLayout: { ...layout, timestamp: + new Date() }
      }
    };
    const updatedDashboardStructure = JSON.parse(JSON.stringify(dashboardStructure));
    updatedDashboardStructure[id] = widgetTemp;
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        structure: updatedDashboardStructure,
      }
    }).subscribe(res => {
    }, error => console.log(error));
  }
}
