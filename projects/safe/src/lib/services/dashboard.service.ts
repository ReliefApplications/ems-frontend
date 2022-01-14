import { Injectable } from '@angular/core';
import { Dashboard, WIDGET_TYPES } from '../models/dashboard.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { EDIT_DASHBOARD, EditDashboardMutationResponse } from '../graphql/mutations';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../graphql/queries';
import { NOTIFICATIONS } from '../const/notifications';
import { SafeSnackBarService } from './snackbar.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SafeDashboardService {

  // === LIST OF DEFAULT WIDGETS AVAILABLE ===
  public availableTiles = WIDGET_TYPES;

  private dashboardSubcription?: Subscription;
  private dashboard = new BehaviorSubject<Dashboard | null>(null);

  get dashboard$(): Observable<Dashboard | null> {
    return this.dashboard.asObservable();
  }

  constructor(
    private apollo: Apollo,
    private router: Router,
    private snackBar: SafeSnackBarService
    ) {}

  /**
   * gets the dashboard.
   * @param id dashboard id to open.
   */
  loadDashboard(id: any): void {
    this.dashboardSubcription = this.apollo.query<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id
        }
      }).subscribe((res) => {
        if (res.data.dashboard) {
          this.openDashboard(res.data.dashboard);
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('dashboard'), { error: true });
          this.router.navigate(['/applications']);
        }
      },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/applications']);
        }
      );
  }

  /**
   * Opens a new dashboard.
   * @param dashboard dashboard to open.
   */
  openDashboard(dashboard: Dashboard): void {
    this.dashboard.next(dashboard);
  }

  /**
   * Closes the dashboard.
   */
  closeDashboard(): void {
    this.dashboardSubcription?.unsubscribe();
    this.dashboard.next(null);
  }

  /**
   * Returns widget layout, comparing the one saved in local storage and the one saved in DB.
   * @param widget widget to get layout of.
   * @returns widget layout to apply.
   */
  getWidgetLayout(widget: any): any {
    const dashboardId = this.dashboard.getValue()?.id;
    return Number(localStorage.getItem(`widget:${dashboardId}:${widget.id}`)) || 0;
  }

  /**
   * Resets the default layout for logged user.
   * @param id dashboard id.
   */
  resetDefaultWidgetLayout(id: number): void {
    try {
      const dashboardId = this.dashboard.getValue()?.id;
      localStorage.removeItem(`widget:${dashboardId}:${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Stores layout of a widget in local storage.
   * @param id dashboard id.
   * @param layoutIndex layout index to save.
   * @returns Stored event.
   */
  saveWidgetLayout(id: number, layoutIndex: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    return localStorage.setItem(`widget:${dashboardId}:${id}`, layoutIndex);
  }

 /**
  * Finds the settings component from the widget passed as 'tile'.
  * @param tile tile to get settings of.
  * @returns Tile settings template.
  */
  public findSettingsTemplate(tile: any): any {
    const availableTile = this.availableTiles.find(x => x.component === tile.component);
    return availableTile && availableTile.settingsTemplate ? availableTile.settingsTemplate : null;
  }

  /**
   * Saves in DB a new layout.
   * @param id dashboard id.
   * @param layout layout to save.
   */
  saveWidgetLayoutToList(id: number, layout: any): Observable<any> {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructure = this.dashboard.getValue()?.structure;

    const index = dashboardStructure.findIndex((v: any) => v.id === id);
    let currentLayout;
    if (dashboardStructure[index].settings.layoutList) {
      currentLayout = {...layout, id: uuidv4(), name: 'layout ' + dashboardStructure[index].settings.layoutList.length};
    }
    else {
      currentLayout = {...layout, id: uuidv4(), name: 'layout 0'};
    }
    let layoutList;
    if (!dashboardStructure[index].settings.layoutList) {
      layoutList = [currentLayout];
    } else {
      layoutList = [...dashboardStructure[index].settings.layoutList, currentLayout];
    }
    const widgetTemp = {
      ...dashboardStructure[index],
      settings: {
        ...dashboardStructure[index].settings,
        layoutList
      }
    };
    const updatedDashboardStructure = JSON.parse(JSON.stringify(dashboardStructure));
    updatedDashboardStructure[index] = widgetTemp;
    return this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        structure: updatedDashboardStructure,
      }
    }).pipe(map(res => {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard.getValue()));
      newDashboard.structure = updatedDashboardStructure;
      this.openDashboard(newDashboard);
      return newDashboard.structure[index].settings.layoutList;
    }));
  }

  /**
   * Saves in DB the old defaultLayout.
   * @param id dashboard id.
   */
  addDefaultLayoutRecoveryToList(id: number): Observable<any> {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructure = this.dashboard.getValue()?.structure;
    const index = dashboardStructure.findIndex((v: any) => v.id === id);
    let updatedDashboardStructure: any;
    const currentLayout = {...JSON.parse(dashboardStructure[index].settings.defaultLayout), timestamp: +new Date(), name: 'default layout recovery', defaultLayoutRecovery: true};
    let layoutList;
    if (!dashboardStructure[index].settings.layoutList) {
      layoutList = [currentLayout];
    } else {
      layoutList = [...dashboardStructure[index].settings.layoutList, currentLayout];
    }
    const widgetTemp = {
      ...dashboardStructure[index],
      settings: {
        ...dashboardStructure[index].settings,
        layoutList
      }
    };
    updatedDashboardStructure = JSON.parse(JSON.stringify(dashboardStructure));
    updatedDashboardStructure[index] = widgetTemp;
    return this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        structure: updatedDashboardStructure,
      }
    }).pipe(map(res => {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard.getValue()));
      newDashboard.structure = updatedDashboardStructure;
      this.loadDashboard(dashboardId);
      return newDashboard.structure[index].settings.layoutList;
    }));
  }

  getDashboardFields(id: number): any {
    const dashboardStructure = this.dashboard.getValue()?.structure;
    const index = dashboardStructure.findIndex((v: any) => v.id === id);
    return {layoutList: dashboardStructure[index].settings.layoutList,
      component: dashboardStructure[index].component,
      defaultLayout: dashboardStructure[index].settings?.defaultLayout};
  }
}
