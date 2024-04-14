import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import {
  Dashboard,
  EditDashboardMutationResponse,
  DashboardState,
  WIDGET_TYPES,
} from '../../models/dashboard.model';
import {
  EditPageContextMutationResponse,
  PageContextT,
} from '../../models/page.model';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { EDIT_DASHBOARD, UPDATE_PAGE_CONTEXT } from './graphql/mutations';
import { GraphQLError } from 'graphql';
import { cloneDeep, get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

/**
 * Shared dashboard service. Handles dashboard events.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /** List of available widgets */
  public availableWidgets = WIDGET_TYPES;
  /** Current dashboard */
  private dashboard?: Dashboard = undefined;
  /** Current dashboard states */
  public states = new BehaviorSubject<DashboardState[]>([]);

  /** @returns Current dashboard states as observable */
  get states$(): Observable<DashboardState[]> {
    return this.states.asObservable();
  }

  /** List of widgets of the current open dashboard*/
  public widgets: any[] = [];

  /**
   * Shared dashboard service. Handles dashboard events.
   *
   * @param environment environment in which we run the application
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    this.availableWidgets = WIDGET_TYPES.filter((widget) =>
      get(environment, 'availableWidgets', []).includes(widget.widgetType)
    );
  }

  /**
   * Opens a new dashboard.
   *
   * @param dashboard dashboard to open.
   */
  openDashboard(dashboard: Dashboard): void {
    this.dashboard = dashboard;
    // Load dashboard states, if any
    this.states.next(dashboard.states ?? []);
  }

  /**
   * Handle mutations messages response from the application, pages and steps
   *
   * @param errors errors from the access mutation response if any
   * @param type content type
   * @param value value of the content edited
   */
  handleEditionMutationResponse(
    errors: readonly GraphQLError[] | undefined,
    type: string,
    value?: string
  ) {
    if (errors) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotUpdated', {
          type,
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectUpdated', {
          type,
          value: value ?? '',
        })
      );
    }
  }

  /**
   * Finds the settings component from the widget.
   *
   * @param widget widget to get settings of.
   * @returns Widget settings template.
   */
  public findSettingsTemplate(widget: any): any {
    const availableWidget = this.availableWidgets.find(
      (x) => x.component === widget.component
    );
    return availableWidget && availableWidget.settingsTemplate
      ? availableWidget.settingsTemplate
      : null;
  }

  /**
   * Updates the context of the page.
   *
   * @param pageId id of the page to update context from
   * @param context The new context of the page
   * @returns promise the mutation result
   */
  public updateContext(pageId: string | undefined, context: PageContextT) {
    if (!pageId) return;

    return firstValueFrom(
      this.apollo.mutate<EditPageContextMutationResponse>({
        mutation: UPDATE_PAGE_CONTEXT,
        variables: {
          id: pageId,
          context,
        },
      })
    );
  }

  /**
   * Edit dashboard name
   *
   * @param dashboardId id of the dashboard
   * @param name new name
   * @param callback callback method
   */
  public editName(
    dashboardId: string | undefined,
    name: string,
    callback?: any
  ): void {
    if (dashboardId) return;
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: dashboardId,
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
   * @param dashboardId id of the dashboard
   * @param buttons Button actions to save
   * @returns apollo mutation
   */
  public saveDashboardButtons(
    dashboardId: string | undefined,
    buttons: Dashboard['buttons']
  ) {
    if (!dashboardId) return;
    buttons = buttons || [];

    return this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: dashboardId,
        buttons,
      },
    });
  }

  /**
   * Edit the dashboard's grid options.
   *
   * @param dashboardId id of the dashboard
   * @param gridOptions new grid options
   * @param callback callback method
   * @returns mutation
   */
  editGridOptions(
    dashboardId: string | undefined,
    gridOptions: any,
    callback?: any
  ) {
    if (!dashboardId) return;
    return this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: dashboardId,
          gridOptions,
        },
      })
      .subscribe(({ errors, data }) => {
        this.handleEditionMutationResponse(
          errors,
          this.translate.instant('common.page.one')
        );
        if (!errors && data) {
          if (callback) callback();
        }
      });
  }

  /**
   * Save the dashboard states changes in the database.
   *
   * @param id dashboard id
   * @param states dashboard states
   */
  private saveDashboardStates(id: string, states: any): void {
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id,
          states: states.map(
            (state: DashboardState) =>
              (state = { id: state.id, name: state.name })
          ),
        },
      })
      .subscribe({
        next: ({ errors }) => {
          if (errors) {
            this.handleEditionMutationResponse(
              errors,
              this.translate.instant('models.dashboard.states.few')
            );
          } else {
            this.dashboard = {
              ...this.dashboard,
              states,
            };
            this.states.next(states);
          }
        },
      });
  }

  /**
   * Delete a dashboard state.
   *
   * @param id state id
   */
  public deleteDashboardState(id: string): void {
    if (!this.dashboard?.id) return;

    const states = this.states
      .getValue()
      .filter((state: DashboardState) => state.id !== id);

    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: this.dashboard?.id,
          states: states.map(
            (state: DashboardState) =>
              (state = { id: state.id, name: state.name })
          ),
        },
      })
      .subscribe({
        next: ({ errors }) => {
          if (errors) {
            this.handleEditionMutationResponse(
              errors,
              this.translate.instant('models.dashboard.states.few')
            );
          } else {
            this.dashboard = {
              ...this.dashboard,
              states,
            };
            this.states.next(states);
          }
        },
      });
  }

  /**
   * Add or update a dashboard state .
   *
   * @param value state value, only necessary if creating a new state
   * @param id state id to identify existing state
   * @param name state name
   * @returns the new state id, or nothing if updating an existing state
   */
  public setDashboardState(
    value: any,
    id?: string,
    name?: string
  ): void | string {
    if (!this.dashboard?.id) {
      return;
    }

    const states = cloneDeep(this.states.getValue());
    if (id) {
      const oldStateIndex = states.findIndex(
        (state: DashboardState) => state.id === id
      );
      if (oldStateIndex !== -1) {
        states[oldStateIndex] = {
          ...states[oldStateIndex],
          value,
          ...(name && { name }),
        };
        this.states.next(states);
        if (name) {
          // On updating state, we only want to save when updating the name, no the values
          this.saveDashboardStates(this.dashboard.id, states);
        }
        return;
      }
    }
    // Create id to the new state
    id = `state-${uuidv4()}`;
    name = name ?? 'STATE-' + (states.length + 1);
    const newState: DashboardState = {
      name,
      value,
      id,
    };
    states.push(newState);
    this.states.next(states);
    // To save new dashboards
    this.saveDashboardStates(this.dashboard.id, states);
    return id;
  }
}
