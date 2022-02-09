import { Injectable } from '@angular/core';
import { Dashboard, WIDGET_TYPES } from '../models/dashboard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  EDIT_DASHBOARD,
  EditDashboardMutationResponse,
} from '../graphql/mutations';

/**
 * Shared dashboard service. Handles dashboard events.
 * TODO: rename all tiles into widgets
 */
@Injectable({
  providedIn: 'root',
})
export class SafeDashboardService {
  /** List of available widgets */
  public availableWidgets = WIDGET_TYPES;
  /** Current dashboard */
  private dashboard = new BehaviorSubject<Dashboard | null>(null);
  /** Current dashboard as observable */
  get dashboard$(): Observable<Dashboard | null> {
    return this.dashboard.asObservable();
  }

  /**
   * Shared dashboard service. Handles dashboard events.
   * TODO: rename all tiles into widgets
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {}

  /**
   * Opens a new dashboard.
   *
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
   *
   * @param widget widget to get layout of.
   * @returns widget layout to apply.
   */
  getWidgetLayout(widget: any): any {
    try {
      const defaultLayout = JSON.parse(
        widget.settings.defaultLayout || JSON.stringify({})
      );
      const defaultDate = new Date(defaultLayout.timestamp || null);
      const dashboardId = this.dashboard.getValue()?.id;
      const cachedLayout = JSON.parse(
        localStorage.getItem(`widget:${dashboardId}:${widget.id}`) ||
          JSON.stringify({})
      );
      const cachedDate = new Date(cachedLayout.timestamp || null);
      if (defaultDate > cachedDate) {
        return defaultLayout;
      } else {
        return cachedLayout;
      }
    } catch {
      const dashboardId = this.dashboard.getValue()?.id;
      const cachedLayout = JSON.parse(
        localStorage.getItem(`widget:${dashboardId}:${widget.id}`) ||
          JSON.stringify({})
      );
      return cachedLayout;
    }
  }

  /**
   * Resets the default layout for logged user.
   *
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
   *
   * @param id dashboard id.
   * @param layout layout to save.
   * @returns Stored event.
   */
  saveWidgetLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    return localStorage.setItem(
      `widget:${dashboardId}:${id}`,
      JSON.stringify({ ...layout, timestamp: +new Date() })
    );
  }

  /**
   * Saves in DB the new default layout.
   *
   * @param id dashboard id.
   * @param layout layout to save.
   */
  saveWidgetDefaultLayout(id: number, layout: any): void {
    const dashboardId = this.dashboard.getValue()?.id;
    const dashboardStructure = this.dashboard.getValue()?.structure;
    const defaultLayout = { ...layout, timestamp: +new Date() };
    const index = dashboardStructure.findIndex((v: any) => v.id === id);
    const widgetTemp = {
      ...dashboardStructure[index],
      settings: {
        ...dashboardStructure[index].settings,
        defaultLayout: JSON.stringify(defaultLayout),
      },
    };
    const updatedDashboardStructure = JSON.parse(
      JSON.stringify(dashboardStructure)
    );
    updatedDashboardStructure[index] = widgetTemp;
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: dashboardId,
          structure: updatedDashboardStructure,
        },
      })
      .subscribe(
        (res) => {},
        (error) => console.log(error)
      );
  }

  /**
   * Finds the settings component from the widget passed as 'tile'.
   *
   * @param tile tile to get settings of.
   * @returns Tile settings template.
   */
  public findSettingsTemplate(tile: any): any {
    const availableTile = this.availableWidgets.find(
      (x) => x.component === tile.component
    );
    return availableTile && availableTile.settingsTemplate
      ? availableTile.settingsTemplate
      : null;
  }
}
