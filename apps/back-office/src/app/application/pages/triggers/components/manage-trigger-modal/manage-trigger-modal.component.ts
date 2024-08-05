import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApplicationService,
  CustomNotification,
  customNotificationRecipientsType,
  GridLayoutService,
  Layout,
  Resource,
  Template,
  TemplateTypeEnum,
  UnsubscribeComponent,
  DistributionList,
} from '@oort-front/shared';
import { NotificationType, Triggers, TriggersType } from '../../triggers.types';
import { takeUntil } from 'rxjs';
import { get } from 'lodash';

/**
 * Dialog data interface.
 */
interface DialogData {
  trigger?: CustomNotification;
  triggerType: TriggersType;
  formGroup: FormGroup;
  resource: Resource;
}

/** Recipients options for email type trigger */
const emailRecipientsOptions = [
  customNotificationRecipientsType.distributionList,
  customNotificationRecipientsType.email,
  customNotificationRecipientsType.userField,
  customNotificationRecipientsType.emailField,
];

/** Recipients options for notification type trigger */
const notificationRecipientsOptions = [
  customNotificationRecipientsType.channel,
  customNotificationRecipientsType.userField,
];

/**
 * Edit/create trigger modal.
 */
@Component({
  selector: 'app-manage-trigger-modal',
  templateUrl: './manage-trigger-modal.component.html',
  styleUrls: ['./manage-trigger-modal.component.scss'],
})
export class ManageTriggerModalComponent extends UnsubscribeComponent {
  /** Trigger form group */
  public formGroup!: FormGroup;
  /** Triggers enum */
  public TriggersEnum = Triggers;
  /** If triggers is for emails */
  public notificationType: NotificationType = NotificationType.email;
  /** Layout */
  public layout?: Layout;
  /** List of recipients options depending on selected type */
  public recipientsTypeOptions?:
    | typeof emailRecipientsOptions
    | typeof notificationRecipientsOptions;

  /** @returns application distribution lists */
  get distributionLists(): DistributionList[] {
    return this.applicationService.distributionLists || [];
  }

  /** @returns application templates */
  get templates(): Template[] {
    return (this.applicationService.templates || []).filter(
      (x) => x.type === TemplateTypeEnum.EMAIL
    );
  }

  /** @returns available users fields */
  get userFields(): any[] {
    return get(this.data.resource, 'metadata', []).filter(
      (x) => x.type === 'users'
    );
  }

  /** @returns available email fields */
  get emailFields(): any[] {
    return get(this.data.resource, 'metadata', []).filter(
      (x) => x.type === 'email'
    );
  }

  /**
   * Edit/create trigger modal.
   *
   * @param data dialog data
   * @param gridLayoutService Shared dataset layout service
   * @param applicationService Shared application service
   * @param dialog Dialog service
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private gridLayoutService: GridLayoutService,
    private applicationService: ApplicationService,
    private dialog: Dialog
  ) {
    super();
    this.formGroup = this.data.formGroup;
    console.log('this.data', this.data);
    this.onNotificationTypeChange(
      this.formGroup.controls.notificationType.value
    );
  }

  /**
   * Opens modal for layout selection/creation
   */
  public async addLayout() {
    const { AddLayoutModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.data.resource,
        hasLayouts: this.data.resource.hasLayouts,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('layout')?.setValue(value);
        } else {
          this.layout = value;
          this.formGroup.get('layout')?.setValue(value.id);
        }
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { EditLayoutModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
        queryName: this.data.resource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.layout) {
        this.gridLayoutService
          .editLayout(this.layout, value, this.data.resource?.id)
          .subscribe((res: any) => {
            this.layout = res.data?.editLayout;
          });
      }
    });
  }

  /**
   * Unset layout.
   */
  public removeLayout(): void {
    this.formGroup.get('layout')?.setValue(null);
    this.layout = undefined;
  }

  /**
   * Opens modal for adding a new email template
   */
  public async addEmailTemplate() {
    const { EditTemplateModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(EditTemplateModalComponent, {
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value)
        this.applicationService.addTemplate(
          {
            name: value.name,
            type: TemplateTypeEnum.EMAIL,
            content: {
              subject: value.subject,
              body: value.body,
            },
          },
          (template: Template) => {
            this.formGroup.get('template')?.setValue(template.id || null);
          }
        );
    });
  }

  /**
   * Unset layout.
   *
   * @param type selected notification type
   */
  public onNotificationTypeChange(type: NotificationType): void {
    this.notificationType = type;
    if (type === NotificationType.email) {
      this.recipientsTypeOptions = emailRecipientsOptions;
    } else {
      this.recipientsTypeOptions = notificationRecipientsOptions;
    }
  }
}
