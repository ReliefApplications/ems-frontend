import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { cronValidator } from '../../../../utils/validators/cron.validator';
import { CustomNotification } from '../../../../models/custom-notification.model';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCE, GET_RESOURCES } from './graphql/queries';
import {
  Resource,
  ResourceQueryResponse,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { isEqual, get } from 'lodash';
import { GridLayoutService } from '../../../../services/grid-layout/grid-layout.service';
import { Template, TemplateTypeEnum } from '../../../../models/template.model';
import { ApplicationService } from '../../../../services/application/application.service';
import { DistributionList } from '../../../../models/distribution-list.model';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadableCronModule } from '../../../../pipes/readable-cron/readable-cron.module';
import { CronExpressionControlModule } from '../../../cron-expression-control/cron-expression-control.module';
import {
  DividerModule,
  TooltipModule,
  RadioModule,
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  DialogModule,
  GraphQLSelectModule,
  IconModule,
  ErrorMessageModule,
} from '@oort-front/ui';

/**
 * Dialog data interface
 */
interface DialogData {
  notification: CustomNotification;
}

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Add / Edit custom notification modal component.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TooltipModule,
    ReadableCronModule,
    DividerModule,
    GraphQLSelectModule,
    CronExpressionControlModule,
    IconModule,
    RadioModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ErrorMessageModule,
  ],
  selector: 'shared-edit-notification-modal',
  templateUrl: './edit-notification-modal.component.html',
  styleUrls: ['./edit-notification-modal.component.scss'],
})
export class EditNotificationModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  public notification?: CustomNotification;
  public formGroup!: ReturnType<typeof this.getNotificationForm>;
  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  public resource?: Resource;
  public layout?: Layout;

  /** @returns application templates */
  get templates(): Template[] {
    return (this.applicationService.templates || []).filter(
      (x) => x.type === TemplateTypeEnum.EMAIL
    );
  }

  /** @returns application distribution lists */
  get distributionLists(): DistributionList[] {
    return this.applicationService.distributionLists || [];
  }

  /** @returns available users fields */
  get userFields(): any[] {
    return get(this.resource, 'metadata', []).filter((x) => x.type === 'users');
  }

  /**
   * Add / Edit custom notification modal component.
   *
   * @param fb Angular form builder
   * @param data Modal injected data
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param gridLayoutService Shared dataset layout service
   * @param applicationService Shared application service
   */
  constructor(
    private fb: FormBuilder,
    @Inject(DIALOG_DATA)
    public data: DialogData,
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: GridLayoutService,
    private applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notification = this.data?.notification;
    // Build form
    this.formGroup = this.getNotificationForm();

    // Initial setup
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
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
    // Subscribe to form changes
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value && !isEqual(value, this.resource?.id)) {
          this.getResource(value);
          this.layout = undefined;
          this.formGroup.get('layout')?.setValue(null);
        } else {
          this.resource = undefined;
          this.layout = undefined;
          this.formGroup.get('layout')?.setValue(null);
        }
      });
    this.formGroup
      .get('recipientsType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.formGroup.get('recipients')?.setValue(null);
        if (value === 'email') {
          this.formGroup.get('recipients.')?.addValidators(Validators.email);
        } else {
          this.formGroup.get('recipients.')?.removeValidators(Validators.email);
        }
      });
    // Build resource query
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Build notification reactive form group.
   *
   * @returns Notification form group
   */
  private getNotificationForm() {
    return this.fb.group({
      name: [get(this.notification, 'name', ''), Validators.required],
      description: [get(this.notification, 'description', '')],
      schedule: [
        get(this.notification, 'schedule', ''),
        [Validators.required, cronValidator()],
      ],
      notificationType: [{ value: 'email', disabled: true }],
      resource: [get(this.notification, 'resource', ''), Validators.required],
      layout: [get(this.notification, 'layout', ''), Validators.required],
      template: [get(this.notification, 'template', ''), Validators.required],
      recipientsType: [get(this.notification, 'recipientsType', 'email')],
      recipients: [
        get(this.notification, 'recipients', null),
        Validators.required,
      ],
    });
  }

  /**
   * Get a resource by id and associated aggregations
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const layoutId = this.formGroup.get('layout')?.value;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          layoutIds: layoutId ? [layoutId] : null,
        },
      })
      .subscribe((res) => {
        this.resource = res.data.resource;
        if (layoutId && this.resource.layouts?.edges[0]) {
          this.layout = this.resource.layouts.edges[0].node;
        }
      });
  }

  /** Opens modal for layout selection/creation */
  public async addLayout() {
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('layout')?.setValue(value);
        } else {
          this.formGroup.get('layout')?.setValue(value.id);
        }
        this.getResource(this.resource?.id as string);
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { EditLayoutModalComponent } = await import(
      '../../../grid-layout/edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
        queryName: this.resource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.layout) {
        this.gridLayoutService
          .editLayout(this.layout, value, this.resource?.id)
          .subscribe((res: any) => {
            this.layout = res.data?.editLayout;
          });
      }
    });
  }

  /** Unset layout. */
  public removeLayout(): void {
    this.formGroup.get('layout')?.setValue(null);
    this.layout = undefined;
  }

  /** Opens modal for adding a new email template */
  public async addEmailTemplate() {
    const { EditTemplateModalComponent } = await import(
      '../../../templates/components/edit-template-modal/edit-template-modal.component'
    );
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
}
