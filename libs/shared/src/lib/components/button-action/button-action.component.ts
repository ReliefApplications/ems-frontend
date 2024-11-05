import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { get, isEmpty, set } from 'lodash';
import { takeUntil } from 'rxjs';
import { Dashboard } from '../../models/dashboard.model';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { ButtonActionT } from './button-action-type';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  EditRecordMutationResponse,
  RecordQueryResponse,
} from '../../models/record.model';
import { EmailService } from '../email/email.service';
import { EDIT_RECORD } from './graphql/mutations';
import { GET_RECORD_BY_ID } from './graphql/queries';
import { Location } from '@angular/common';

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
  /** Reload dashboard event emitter */
  @Output() reloadDashboard = new EventEmitter<void>();
  /** Context id of the current dashboard */
  public contextId!: string;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param emailService Email service
   * @param activatedRoute Activated route
   * @param apollo Apollo
   * @param location Angular location
   */
  constructor(
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    private emailService: EmailService,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private location: Location
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
    // Navigation to url
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
      return;
    }
    // Navigation to previous page
    if (button.previousPage) {
      this.location.back();
      return;
    }
    // Edit Record & Add Record
    if (button.editRecord || button.addRecord) {
      this.openRecordModal(button);
      return;
    }
    // Notifications
    if (
      button.subscribeToNotification &&
      button.subscribeToNotification.notification
    ) {
      this.emailService.subscribeToEmail(
        button.subscribeToNotification.notification
      );
    }
  }

  /**
   * Open record modal to add/edit a record
   *
   * @param button action to be executed
   */
  private async openRecordModal(button: ButtonActionT) {
    // recordId: this.contextId,
    // todo: distinction between addRecord & editRecord
    const { FormModalComponent } = await import(
      '../form-modal/form-modal.component'
    );
    const template = button.editRecord
      ? button.editRecord.template
      : button.addRecord?.template;
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        ...(button.editRecord && { recordId: this.contextId }), // button must be hidden in html if editRecord is enabled & no contextId
        ...(template && { template }),
        actionButtonCtx: true,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && value.data?.id && button.addRecord) {
        const newRecordId = value.data.id;
        const fieldsForUpdate = button.addRecord.fieldsForUpdate || [];
        // Execute callback if possible
        if (
          this.contextId &&
          Array.isArray(fieldsForUpdate) &&
          fieldsForUpdate.length > 0
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
              for (const field of fieldsForUpdate as string[]) {
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
      if (
        button.editRecord?.reloadDashboard ||
        button.addRecord?.reloadDashboard
      ) {
        this.reloadDashboard.emit();
      }
    });
  }
}
