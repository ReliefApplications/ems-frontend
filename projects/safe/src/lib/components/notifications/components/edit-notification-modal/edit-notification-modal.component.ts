import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cronValidator } from '../../../../utils/validators/cron.validator';
import { CustomNotification } from '../../../../models/custom-notification.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCE,
  GET_RESOURCES,
} from './graphql/queries';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { AddLayoutModalComponent } from '../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { isEqual, get } from 'lodash';
import { SafeEditLayoutModalComponent } from '../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { SafeGridLayoutService } from '../../../../services/grid-layout/grid-layout.service';
import { EditTemplateModalComponent } from '../../../templates/components/edit-template-modal/edit-template-modal.component';
import { Template, TemplateTypeEnum } from '../../../../models/template.model';
import { SafeApplicationService } from '../../../../services/application/application.service';
import { DistributionList } from '../../../../models/distribution-list.model';

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
  selector: 'safe-edit-notification-modal',
  templateUrl: './edit-notification-modal.component.html',
  styleUrls: ['./edit-notification-modal.component.scss'],
})
export class EditNotificationModalComponent implements OnInit {
  public formGroup!: FormGroup;
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource?: Resource;
  public layout?: Layout;

  /** @returns application templates */
  get templates(): any[] {
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
   * @param formBuilder Angular form builder
   * @param data Modal injected data
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Shared dataset layout service
   * @param applicationService Shared application service
   */
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    private apollo: Apollo,
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService,
    private applicationService: SafeApplicationService
  ) {}

  ngOnInit(): void {
    // Build form
    this.formGroup = this.formBuilder.group({
      name: [get(this.data, 'notification.name', ''), Validators.required],
      description: [get(this.data, 'notification.description', '')],
      schedule: [
        get(this.data, 'pullJob.schedule', ''),
        [Validators.required, cronValidator()],
      ],
      notificationType: [{ value: 'email', disabled: true }],
      resource: [
        get(this.data, 'notification.resource', ''),
        Validators.required,
      ],
      layout: [get(this.data, 'notification.layout', ''), Validators.required],
      template: [
        get(this.data, 'notification.template', ''),
        Validators.required,
      ],
      recipientsType: [get(this.data, 'notification.recipientsType', 'email')],
      recipients: [
        get(this.data, 'notification.recipients', null),
        Validators.required,
      ],
    });
    // Initial setup
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
    }
    if (this.formGroup.value.recipientsType === 'email') {
      this.formGroup.get('recipients')?.addValidators(Validators.email);
    }
    // Subscribe to form changes
    this.formGroup.get('resource')?.valueChanges.subscribe((value) => {
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
    this.formGroup.get('recipientsType')?.valueChanges.subscribe((value) => {
      this.formGroup.get('recipients')?.setValue(null);
      if (value === 'email') {
        this.formGroup.get('recipients.')?.addValidators(Validators.email);
      } else {
        this.formGroup.get('recipients.')?.removeValidators(Validators.email);
      }
    });
    // Build resource query
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
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
      .query<GetResourceByIdQueryResponse>({
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
        console.log(this.resource.metadata);
      });
  }

  /** Opens modal for layout selection/creation */
  public addLayout() {
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
  public editLayout(): void {
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
  public addEmailTemplate() {
    const dialogRef = this.dialog.open(EditTemplateModalComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
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
            this.formGroup.get('template')?.setValue(template.id);
          }
        );
    });
  }
}
