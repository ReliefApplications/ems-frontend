import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Channel } from '../../../../models/channel.model';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { ContentType } from '../../../../models/page.model';
import { SafeWorkflowService } from '../../../../services/workflow/workflow.service';
import { Template, TemplateTypeEnum } from '../../../../models/template.model';
import { Dialog } from '@angular/cdk/dialog';
import { createQueryForm } from '../../../query-builder/query-builder-forms';
import { DistributionList } from '../../../../models/distribution-list.model';
import { SafeApplicationService } from '../../../../services/application/application.service';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
/** List fo disabled fields */
const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

/**
 * Configuration component for grid widget button.
 */
@Component({
  selector: 'safe-button-config',
  templateUrl: './button-config.component.html',
  styleUrls: ['./button-config.component.scss'],
})
export class ButtonConfigComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Output() deleteButton: EventEmitter<boolean> = new EventEmitter();
  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];
  @Input() channels: Channel[] = [];
  @Input() relatedForms: Form[] = [];

  public targetResource?: Resource;
  public relatedResources: Resource[] = [];

  @Input() distributionLists: DistributionList[] = [];
  @Input() templates: Template[] = [];
  // Indicate is the page is a single dashboard.
  public isDashboard = false;

  // Indicate if the next step is a Form and so we could potentially pass some data to it.
  public canPassData = false;

  /** @returns The list of fields which are of type scalar and not disabled */
  get scalarFields(): any[] {
    return this.fields.filter(
      (x) => x.type.kind === 'SCALAR' && !DISABLED_FIELDS.includes(x.name)
    );
  }

  /** @returns The list of email templates */
  get mailTemplates(): any[] {
    return this.templates.filter((x) => x.type === TemplateTypeEnum.EMAIL);
  }

  /**
   * Configuration component for grid widget button.
   *
   * @param fb Form builder
   * @param router Angular Router service
   * @param workflowService Shared workflow service
   * @param dialog Dialog service
   * @param applicationService Shared application service
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workflowService: SafeWorkflowService,
    public dialog: Dialog,
    private applicationService: SafeApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    if (
      this.router.url.includes('dashboard') &&
      !this.router.url.includes('workflow')
    ) {
      this.isDashboard = true;
    } else {
      const currentStepContent = this.router.url.split('/').pop();
      this.workflowService.workflow$
        .pipe(takeUntil(this.destroy$))
        .subscribe((workflow) => {
          if (workflow) {
            const steps = workflow.steps || [];
            const currentStepIndex = steps.findIndex(
              (x) => x.content === currentStepContent
            );
            if (currentStepIndex >= 0) {
              const nextStep = steps[currentStepIndex + 1];
              this.canPassData = nextStep && nextStep.type === ContentType.form;
            }
          } else {
            const workflowId = this.router.url
              .split('/workflow/')
              .pop()
              ?.split('/')
              .shift();
            this.workflowService.loadWorkflow(workflowId);
          }
        });
    }

    this.formGroup
      ?.get('prefillForm')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup
            ?.get('prefillTargetForm')
            ?.setValidators(Validators.required);
        } else {
          this.formGroup?.get('prefillTargetForm')?.clearValidators();
        }
        this.formGroup?.get('prefillTargetForm')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('notify')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup
            ?.get('notificationChannel')
            ?.setValidators(Validators.required);
          this.formGroup
            ?.get('notificationMessage')
            ?.setValidators(Validators.required);
        } else {
          this.formGroup?.get('notificationChannel')?.clearValidators();
          this.formGroup?.get('notificationMessage')?.clearValidators();
        }
        this.formGroup?.get('notificationChannel')?.updateValueAndValidity();
        this.formGroup?.get('notificationMessage')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('publish')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup
            ?.get('publicationChannel')
            ?.setValidators(Validators.required);
        } else {
          this.formGroup?.get('publicationChannel')?.clearValidators();
        }
        this.formGroup?.get('publicationChannel')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('show')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.deleteInvalidModifications();
          this.formGroup?.controls.notify.setValue(false);
          this.formGroup?.controls.publish.setValue(false);
        }
      });

    this.formGroup
      ?.get('modifySelectedRows')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.deleteInvalidModifications();
        }
      });

    this.formGroup
      ?.get('attachToRecord')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup?.get('targetForm')?.setValidators(Validators.required);
        } else {
          this.formGroup?.get('targetForm')?.clearValidators();
          this.formGroup?.get('targetForm')?.setValue(null);
        }
        this.formGroup?.get('targetForm')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('sendMail')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup?.get('templates')?.setValidators(Validators.required);
        } else {
          this.formGroup?.get('distributionList')?.clearValidators();
          this.formGroup?.get('templates')?.clearValidators();
        }
        this.formGroup?.get('distributionList')?.updateValueAndValidity();
        this.formGroup?.get('templates')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('targetResource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.targetResource = this.relatedResources.find(
            (x) => x.id === value
          );
          if (this.targetResource) {
            this.formGroup
              ?.get('targetForm')
              ?.setValidators(Validators.required);
            this.formGroup
              ?.get('targetFormField')
              ?.setValidators(Validators.required);
            this.formGroup
              ?.get('targetFormQuery.name')
              ?.setValue(this.targetResource.queryName);
            this.formGroup
              ?.get('targetFormQuery.fields')
              ?.setValidators([Validators.required]);
          } else {
            this.formGroup?.get('targetForm')?.clearValidators();
            this.formGroup?.get('targetForm')?.setValue(null);
            this.formGroup?.get('targetFormField')?.clearValidators();
            this.formGroup?.get('targetFormField')?.setValue(null);
            this.formGroup?.get('targetFormQuery')?.clearValidators();
          }
        } else {
          this.targetResource = undefined;
          this.formGroup?.get('targetForm')?.clearValidators();
          this.formGroup.get('targetForm')?.setValue(null);
          this.formGroup?.get('targetFormField')?.clearValidators();
          this.formGroup?.get('targetFormField')?.setValue(null);
          this.formGroup
            .get('targetFormQuery')
            ?.patchValue(createQueryForm(null, false));
        }
        this.formGroup?.get('targetForm')?.updateValueAndValidity();
        this.formGroup?.get('targetFormField')?.updateValueAndValidity();
        this.formGroup?.get('targetFormQuery')?.updateValueAndValidity();
      });

    this.setRelatedResources();
    if (this.formGroup.value.targetResource) {
      this.targetResource = this.relatedResources.find(
        (x) => x.id === this.formGroup.value.targetResource
      );
    }

    this.formGroup
      ?.get('sendMail')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((sendEmail: boolean) => {
        if (sendEmail) {
          this.formGroup
            ?.get('bodyFields')
            ?.setValidators([Validators.required]);
        } else {
          this.formGroup?.get('bodyFields')?.clearValidators();
        }
        this.formGroup?.get('bodyFields')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('closeWorkflow')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((closeWorkflow: boolean) => {
        if (closeWorkflow) {
          this.formGroup
            ?.get('confirmationText')
            ?.setValidators([Validators.required]);
        } else {
          this.formGroup?.get('confirmationText')?.clearValidators();
        }
        this.formGroup?.get('confirmationText')?.updateValueAndValidity();
      });

    this.formGroup
      ?.get('selectAll')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectAll: boolean) => {
        if (selectAll) {
          this.formGroup?.controls.selectPage.setValue(false);
          this.formGroup?.get('selectPage')?.updateValueAndValidity();
        }
      });

    this.formGroup
      ?.get('selectPage')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectPage: boolean) => {
        if (selectPage) {
          this.formGroup?.controls.selectAll.setValue(false);
          this.formGroup?.get('selectAll')?.updateValueAndValidity();
        }
      });
  }

  /** Set list of resources user can attach a record to */
  private setRelatedResources(): void {
    const resources: Resource[] = [];
    for (const form of this.relatedForms) {
      const resource = resources.find((x) => x.id === form.resource?.id);
      if (resource) {
        resource.forms?.push(form);
      } else {
        resources.push({ ...form.resource, forms: [form] } as Resource);
      }
    }
    this.relatedResources = resources;
  }

  /**
   * Check if 2 fields have the same name
   *
   * @param field1 A field, with a name attribute
   * @param field2 A field, with a name attribute
   * @returns True if the name are equals, False if not or if field2 is null
   */
  compareFields(field1: any, field2: any): boolean {
    if (field2) {
      return field1.name === field2.name;
    } else {
      return false;
    }
  }

  /** @returns An array of the modifications on button form */
  get modificationsArray(): UntypedFormArray {
    return this.formGroup?.get('modifications') as UntypedFormArray;
  }

  /**
   * Delete a modification
   *
   * @param index The index of the modification
   */
  onDeleteModification(index: number): void {
    this.modificationsArray.removeAt(index);
  }

  /**
   * Create a new modification
   */
  onAddModification(): void {
    this.modificationsArray.push(
      this.fb.group({
        field: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  /**
   * Delete all the invalid modifications
   */
  private deleteInvalidModifications(): void {
    const modifications = this.formGroup?.get(
      'modifications'
    ) as UntypedFormArray;
    for (let i = 0; i < modifications.value.length; i++) {
      const modification = modifications.at(i);
      if (modification.invalid) {
        modifications.removeAt(i);
        i--;
      }
    }
  }

  /** Open edit modal components and create new distribution list */
  public async addDistributionList() {
    const { EditDistributionListModalComponent } = await import(
      '../../../distribution-lists/components/edit-distribution-list-modal/edit-distribution-list-modal.component'
    );
    const dialogRef = this.dialog.open(EditDistributionListModalComponent, {
      data: null,
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.addDistributionList(
          {
            name: value.name,
            emails: value.emails,
          },
          (list: DistributionList) => {
            this.formGroup.get('distributionList')?.setValue(list.id);
          }
        );
      }
    });
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
            const templates = [
              ...(this.formGroup.get('templates')?.value || []),
            ];
            templates.push(template.id);
            this.formGroup.get('templates')?.setValue(templates);
          }
        );
    });
  }

  /**
   * Emit the event to delete the button
   */
  public emitDeleteButton(): void {
    this.deleteButton.emit(true);
  }

  /**
   * Get scalar field from name
   *
   * @param fieldName field name
   * @returns scalar field ( if exists )
   */
  public scalarField(fieldName: string): any {
    return this.scalarFields.find((field: any) => field.name === fieldName);
  }
}
