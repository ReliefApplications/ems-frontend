import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {Apollo} from 'apollo-angular';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../graphql/queries';

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

  getWidgetLayout(id: number): any {
    const dashboardId = this.dashboard.getValue()?.id;
    this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: dashboardId
      }
    }).valueChanges.subscribe((res) => {
        if (res.data.dashboard) {
          // is dashboard
          console.log('*** IF: res.data.dashboard');
          console.log(res.data.dashboard);
        } else {
          // no dashboard
          console.log('*** ELSE: res');
          console.log(res);
        }
      },
      (err) => {
        // error
        console.log('ERROR : GET_DASHBOARD_BY_ID');
      }
    );

    const cachedLayout = localStorage.getItem(`widget:${dashboardId}:${id}`);
    return cachedLayout ? JSON.parse(cachedLayout) : {};
  }

  saveWidgetLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    return localStorage.setItem(`widget:${dashboardId}:${id}`, JSON.stringify(layout));
  }
}
