import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  Dashboard,
  EditDashboardMutationResponse,
} from '../../models/dashboard.model';
import {
  EDIT_DASHBOARD_ACTIONS,
  EDIT_PAGE_ACTIONS,
  EDIT_STEP_ACTIONS,
} from './graphql/mutations';

/**
 * Shared quick actions service. Handles quick action button updates.
 */
@Injectable({
  providedIn: 'root',
})
export class QuickActionsService {
  /**
   * Shared quick actions service. Handles quick action button updates.
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {}

  /**
   * Saves the buttons of the given page.
   *
   * @param pageId id of the linked page
   * @param buttons Button actions to save
   * @param context context of the given page id
   * @param isStepPage if given page is part of a workflow or not
   * @returns apollo mutation
   */
  public savePageButtons(
    pageId: string | undefined,
    buttons: Dashboard['buttons'],
    context: 'dashboard' | 'form' = 'dashboard',
    isStepPage = false
  ) {
    if (!pageId) {
      return;
    }
    buttons = buttons || [];
    let mutation = EDIT_DASHBOARD_ACTIONS;
    if (context === 'form') {
      if (isStepPage) {
        mutation = EDIT_STEP_ACTIONS;
      } else {
        mutation = EDIT_PAGE_ACTIONS;
      }
    }
    return this.apollo.mutate<EditDashboardMutationResponse>({
      mutation,
      variables: {
        id: pageId,
        buttons,
      },
    });
  }
}
