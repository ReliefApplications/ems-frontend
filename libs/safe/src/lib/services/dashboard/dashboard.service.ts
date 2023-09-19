import { Inject, Injectable } from '@angular/core';
import { Dashboard, WIDGET_TYPES } from '../../models/dashboard.model';
import { PageContextT } from '../../models/page.model';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  EDIT_DASHBOARD,
  EditDashboardMutationResponse,
  EditPageContextMutationResponse,
  UPDATE_PAGE_CONTEXT,
  CreateDashboardWithContextMutationResponse,
  CREATE_DASHBOARD_WITH_CONTEXT,
} from './graphql/mutations';
import get from 'lodash/get';

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
  /** @returns Current dashboard as observable */
  get dashboard$(): Observable<Dashboard | null> {
    return this.dashboard.asObservable();
  }

  /**
   * Shared dashboard service. Handles dashboard events.
   * TODO: rename all tiles into widgets
   *
   * @param environment environment in which we run the application
   * @param apollo Apollo client
   */
  constructor(@Inject('environment') environment: any, private apollo: Apollo) {
    this.availableWidgets = WIDGET_TYPES.filter((widget) =>
      get(environment, 'availableWidgets', []).includes(widget.id)
    );
  }

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
      .subscribe({
        error: (error) => console.log(error),
      });
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

  /**
   * Updates the context of the page.
   *
   * @param context The new context of the page
   * @returns promise the mutation result
   */
  public updateContext(context: PageContextT) {
    const dashboard = this.dashboard.getValue();
    if (!dashboard?.page?.id) return;

    const res = firstValueFrom(
      this.apollo.mutate<EditPageContextMutationResponse>({
        mutation: UPDATE_PAGE_CONTEXT,
        variables: {
          id: dashboard.page.id,
          context,
        },
      })
    );

    res.then(({ data }) => {
      if (data) {
        this.dashboard.next({
          ...dashboard,
          page: {
            ...dashboard.page,
            context,
            contentWithContext: data.editPageContext.contentWithContext,
          },
        });
      }
    });

    return res;
  }

  /**
   * Duplicates a dashboard and adds context to it.
   *
   * @param page Page to copy content from
   * @param context The type of context to be added to the dashboard
   * @param id The id of the context to be added to the dashboard
   * @returns The newly created dashboard
   */
  public createDashboardWithContext(
    page: string,
    context: 'element' | 'record',
    id: string | number
  ) {
    return firstValueFrom(
      this.apollo.mutate<CreateDashboardWithContextMutationResponse>({
        mutation: CREATE_DASHBOARD_WITH_CONTEXT,
        variables: {
          page,
          [context]: id,
        },
      })
    );
  }

  /**
   * Edit dashboard name
   *
   * @param name new name
   * @param callback callback method
   */
  public editName(name: string, callback?: any): void {
    const dashboard = this.dashboard.getValue();
    if (!dashboard?.id) return;
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: dashboard.id,
          name,
        },
      })
      .subscribe(() => {
        if (callback) callback();
      });
  }

  /**
   * Saves the buttons of the dashboard.
   *
   * @param buttons Button actions to save
   */
  public saveDashboardButtons(buttons: Dashboard['buttons']) {
    const dashboard = this.dashboard.getValue();
    if (!dashboard?.id) return;
    buttons = buttons || [];

    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: dashboard.id,
          buttons,
        },
      })
      .subscribe(() => {
        this.dashboard.next({
          ...dashboard,
          buttons,
        });
      });
  }
}
