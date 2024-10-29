import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  Dashboard,
  EditDashboardMutationResponse,
} from '../../models/dashboard.model';
import { EDIT_DASHBOARD_ACTIONS, EDIT_FORM_ACTIONS } from './graphql/mutations';

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
   * @returns apollo mutation
   */
  public savePageButtons(
    pageId: string | undefined,
    buttons: Dashboard['buttons'],
    context: 'dashboard' | 'form' = 'dashboard'
  ) {
    if (!pageId) {
      return;
    }
    buttons = buttons || [];
    return this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: context === 'form' ? EDIT_FORM_ACTIONS : EDIT_DASHBOARD_ACTIONS,
      variables: {
        id: pageId,
        buttons,
      },
    });
  }
}
