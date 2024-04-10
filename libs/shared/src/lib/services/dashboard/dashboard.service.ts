import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import {
  Dashboard,
  EditDashboardMutationResponse,
  WIDGET_TYPES,
} from '../../models/dashboard.model';
import {
  EditPageContextMutationResponse,
  PageContextT,
} from '../../models/page.model';
import { firstValueFrom } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { EDIT_DASHBOARD, UPDATE_PAGE_CONTEXT } from './graphql/mutations';
import get from 'lodash/get';
import { GraphQLError } from 'graphql';

/**
 * Shared dashboard service. Handles dashboard events.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /** List of available widgets */
  public availableWidgets = WIDGET_TYPES;
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
}
