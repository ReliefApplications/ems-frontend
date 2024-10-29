import { Dialog } from '@angular/cdk/dialog';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Dashboard } from '../../models/dashboard.model';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ButtonActionT } from './button-action-type';
import { Apollo } from 'apollo-angular';
import {
  EditRecordMutationResponse,
  RecordQueryResponse,
} from '../../models/record.model';
import { GET_RECORD_BY_ID } from './graphql/queries';
import { EDIT_RECORD } from './graphql/mutations';
import { isEmpty, set, get } from 'lodash';

/** Component for display action buttons */
@Component({
  selector: 'shared-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent extends UnsubscribeComponent {
  /** Button actions */
  @Input() buttonActions: ButtonActionT[] = [];
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Can update dashboard or not */
  @Input() canUpdate = false;
  /** Context id of the current dashboard */
  private contextId!: string;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param activatedRoute Activated route
   * @param apollo Apollo
   */
  constructor(
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo
  ) {
    super();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ id }) => {
        this.contextId = id;
      },
    });
  }

  /**
   * Opens link of button action.
   *
   * @param button Button action to be executed
   */
  public onButtonActionClick(button: ButtonActionT) {
    if (button.href) {
      const href = this.dataTemplateService.renderLink(button.href);
      if (button.openInNewTab) {
        window.open(href, '_blank');
      } else {
        if (href?.startsWith('./')) {
          // Navigation inside the app builder
          this.router.navigateByUrl(href.substring(1));
        } else {
          window.location.href = href;
        }
      }
    } else if (button.resource) {
      this.openRecordModal(button);
    }
  }

  /**
   * Open record modal to add/edit a record
   *
   * @param button action to be executed
   */
  private async openRecordModal(button: ButtonActionT) {
    const { FormModalComponent } = await import(
      '../form-modal/form-modal.component'
    );
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        template: button.template,
        actionButtonCtx: true,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && value.data?.id) {
        const newRecordId = value.data.id;
        // Execute callback if possible
        if (
          this.contextId &&
          Array.isArray(button.recordFields) &&
          button.recordFields.length > 0
        ) {
          this.apollo
            .query<RecordQueryResponse>({
              query: GET_RECORD_BY_ID,
              variables: {
                id: this.contextId,
              },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data }) => {
              const update = {};
              for (const field of button.recordFields as string[]) {
                const resourceField = data.record.resource?.fields.find(
                  (f: any) => f.name === field
                );
                if (resourceField) {
                  // Current field value in record
                  const value = get(data.record.data, field);
                  switch (resourceField.type) {
                    case 'resource': {
                      set(update, field, newRecordId);
                      break;
                    }
                    case 'resources': {
                      if (Array.isArray(value)) {
                        set(update, field, [...value, newRecordId]);
                      } else {
                        set(update, field, [newRecordId]);
                      }
                      break;
                    }
                    // Else, skip
                  }
                }
                // Else, skip
              }
              // If update not empty
              if (!isEmpty(update)) {
                this.apollo
                  .mutate<EditRecordMutationResponse>({
                    mutation: EDIT_RECORD,
                    variables: {
                      id: this.contextId,
                      data: update,
                    },
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              }
            });
        }
      }
    });
  }
}
