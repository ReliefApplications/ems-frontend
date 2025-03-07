import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
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
  Channel,
  ChannelsQueryResponse,
  ResourceQueryResponse,
} from '@oort-front/shared';
import { NotificationType, Triggers, TriggersType } from '../../triggers.types';
import { takeUntil } from 'rxjs';
import { get } from 'lodash';
import { Apollo } from 'apollo-angular';
import { GET_CHANNELS, GET_LAYOUT } from './graphql/queries';

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
export class ManageTriggerModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Trigger form group */
  public formGroup!: FormGroup;
  /** Triggers enum */
  public TriggersEnum = Triggers;
  /** Layout */
  public layout?: Layout;
  /** List of channels */
  public channels?: Channel[];
  /** List of pages */
  public pages$ = this.applicationService.pages$;
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
      (x) => x.type === this.formGroup.value.notificationType
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

  /** Indicates if initiating component */
  private init = true;

  /**
   * Edit/create trigger modal.
   *
   * @param data dialog data
   * @param gridLayoutService Shared dataset layout service
   * @param applicationService Shared application service
   * @param dialog Dialog service
   * @param apollo The apollo client
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private gridLayoutService: GridLayoutService,
    private applicationService: ApplicationService,
    private dialog: Dialog,
    private apollo: Apollo
  ) {
    super();
    this.formGroup = this.data.formGroup;
    this.onNotificationTypeChange(
      this.formGroup.controls.notificationType.value
    );
  }

  ngOnInit(): void {
    // Load all application channels
    this.getChannels();

    // If editing trigger, get layout
    if (this.data.trigger?.layout) {
      this.getLayout(this.data.trigger?.layout);
    }

    // Add email validation to recipients field if recipients type is email
    this.formGroup
      .get('recipientsType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === 'email') {
          this.formGroup.get('recipients')?.addValidators(Validators.email);
        } else {
          this.formGroup.get('recipients')?.removeValidators(Validators.email);
        }
      });

    this.init = false;
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
          this.getLayout(value);
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
  public async addTemplate() {
    const { EditTemplateModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(EditTemplateModalComponent, {
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const content =
          value.type === TemplateTypeEnum.EMAIL
            ? {
                subject: value.subject,
                body: value.body,
              }
            : {
                title: value.title,
                description: value.description,
              };
        this.applicationService.addTemplate(
          {
            name: value.name,
            type: value.type,
            content,
          },
          (template: Template) => {
            this.formGroup.get('template')?.setValue(template.id || null);
          }
        );
      }
    });
  }

  /**
   * Handle redirect active or not:
   * If redirection not active, remove validator from url and type controls if necessary.
   * If active, add validator to type.
   */
  public onRedirectToggle(): void {
    if (!this.formGroup.value.redirect.active) {
      this.formGroup
        .get('redirect.type')
        ?.removeValidators(Validators.required);
      this.onRedirectTypeChange(undefined);
    } else {
      this.formGroup.get('redirect.type')?.addValidators(Validators.required);
    }
    this.formGroup.get('redirect.type')?.updateValueAndValidity();
  }

  /**
   * Handle redirect type change.
   *
   * @param type selected notification type
   */
  public onRedirectTypeChange(type: 'url' | 'recordIds' | undefined): void {
    if (!this.init) {
      this.formGroup.get('redirect.url')?.setValue('');
    }
    if (type) {
      if (type === 'url') {
        this.formGroup.get('redirect.url')?.addValidators(Validators.required);
      } else {
        this.formGroup
          .get('redirect.url')
          ?.removeValidators(Validators.required);
      }
    } else {
      this.formGroup.get('redirect.url')?.removeValidators(Validators.required);
    }
    this.formGroup.get('redirect.url')?.updateValueAndValidity();
  }

  /**
   * Handle notification type change.
   *
   * @param type selected notification type
   */
  public onNotificationTypeChange(type: NotificationType | undefined): void {
    if (!this.init) {
      this.formGroup.get('recipients')?.setValue('');
      this.formGroup.get('recipientsType')?.setValue('');
      this.formGroup.get('template')?.setValue('');
    }
    if (type) {
      if (type === NotificationType.email) {
        this.formGroup.get('redirect.active')?.setValue(false);
        this.formGroup.get('redirect.type')?.setValue('');
        this.onRedirectToggle();
        this.recipientsTypeOptions = emailRecipientsOptions;
      } else {
        this.onRedirectToggle();
        this.recipientsTypeOptions = notificationRecipientsOptions;
      }
    }
  }

  /**
   * Load channels query data.
   */
  private getChannels(): void {
    this.apollo
      .query<ChannelsQueryResponse>({
        query: GET_CHANNELS,
        variables: {
          application: this.applicationService.application.getValue()?.id,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.channels = data.channels;
      });
  }

  /**
   * Load layout by its id.
   *
   * @param layoutId id of the layout
   */
  private getLayout(layoutId: string): void {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id: layoutId,
          resource: this.data.resource.id,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.layout = data.resource.layouts?.edges[0]?.node;
        this.formGroup.get('layout')?.setValue(this.layout?.id);
      });
  }
}
