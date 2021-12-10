import { Injectable } from '@angular/core';
import { Dashboard, WIDGET_TYPES } from '../models/dashboard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { EDIT_DASHBOARD, EditDashboardMutationResponse } from '../graphql/mutations';

@Injectable({
  providedIn: 'root'
})
export class SafeDashboardService {

  // === LIST OF DEFAULT WIDGETS AVAILABLE ===
  public availableTiles = WIDGET_TYPES;

  private dashboard = new BehaviorSubject<Dashboard | null>(null);

  get dashboard$(): Observable<Dashboard | null> {
    return this.dashboard.asObservable();
  }

  constructor(private apollo: Apollo) {}

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
    this.dashboard.next(null);
  }

  /**
   * Returns widget layout, comparing the one saved in local storage and the one saved in DB.
   * @param widget widget to get layout of.
   * @returns widget layout to apply.
   */
  getWidgetLayout(widget: any): any {
    try {
      const defaultLayout = JSON.parse(widget.settings.defaultLayout || JSON.stringify({}));
      const defaultDate = new Date(defaultLayout.timestamp || null);
      const dashboardId = this.dashboard.getValue()?.id;
      const cachedLayout = JSON.parse(localStorage.getItem(`widget:${dashboardId}:${widget.id}`) || JSON.stringify({}));
      const cachedDate = new Date(cachedLayout.timestamp || null);
      if (defaultDate > cachedDate) {
        if (!(defaultLayout && Object.keys(defaultLayout).length === 0 && Object.getPrototypeOf(defaultLayout) === Object.prototype)) {
          defaultLayout.sort = [];
          defaultLayout.filter = {filter: [], logic: 'and'};
        }
        return defaultLayout;
      } else {
        return cachedLayout;
      }
    } catch {
      const dashboardId = this.dashboard.getValue()?.id;
      const cachedLayout = JSON.parse(localStorage.getItem(`widget:${dashboardId}:${widget.id}`) || JSON.stringify({}));
      return cachedLayout;
    }
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
   * @param layout layout to save.
   * @returns Stored event.
   */
  saveWidgetLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    return localStorage.setItem(`widget:${dashboardId}:${id}`, JSON.stringify({ ...layout, timestamp: + new Date() }));
  }

  /**
   * Saves in DB the new default layout.
   * @param id dashboard id.
   * @param layout layout to save.
   */
  saveWidgetDefaultLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructure = this.dashboard.getValue()?.structure;
    console.log('dashboardStructure');
    console.log(dashboardStructure);
    const defaultLayout = { ...layout, timestamp: + new Date() };
    console.log('defaultLayout');
    console.log(defaultLayout);
    const index = dashboardStructure.findIndex((v: any) => v.id === id);
    const widgetTemp = {
      ...dashboardStructure[index],
      settings: {
        ...dashboardStructure[index].settings,
        defaultLayout: JSON.stringify(defaultLayout)
      }
    };
    const updatedDashboardStructure = JSON.parse(JSON.stringify(dashboardStructure));
    updatedDashboardStructure[index] = widgetTemp;
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        structure: updatedDashboardStructure,
      }
    }).subscribe(res => {
      console.log(res);
    }, error => console.log(error));
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
  saveWidgetLayoutToList(id: number, layout: any): any {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructure = this.dashboard.getValue()?.structure;
    const currentLayout = { ...layout, timestamp: + new Date() };
    const index = dashboardStructure.findIndex((v: any) => v.id === id);
    let layoutList;
    if (!dashboardStructure[index].settings.layoutList){
      layoutList = [currentLayout];
    }
    else {
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
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        structure: updatedDashboardStructure,
      }
    }).subscribe(res => {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard.getValue()));
      newDashboard.structure = updatedDashboardStructure;
      console.log('newDashboard.structure');
      console.log(newDashboard.structure);
      this.openDashboard(newDashboard);
      return newDashboard.structure[index].settings.layoutList;
    }, error => console.log(error));
  }
}
