import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Channel } from '../../../../models/channel.model';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { ContentType } from '../../../../models/page.model';
import { SafeWorkflowService } from '../../../../services/workflow/workflow.service';
import { Subscription } from 'rxjs';
import {
  MatChipInputEvent,
  MAT_CHIPS_DEFAULT_OPTIONS,
} from '@angular/material/chips';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { MatDialog } from '@angular/material/dialog';
import { EMAIL_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { createQueryForm } from '../../../query-builder/query-builder-forms';

/** List fo disabled fields */
const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];
/** Key codes of separators */
const SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

/**
 * Function that create a function which returns an object with the separator keys
 *
 * @returns A function which returns an object with the separator keys
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function codesFactory(): () => any {
  const codes = () => ({ separatorKeyCodes: SEPARATOR_KEYS_CODE });
  return codes;
}

/**
 * Configuration component for grid widget button.
 */
@Component({
  selector: 'safe-button-config',
  templateUrl: './button-config.component.html',
  styleUrls: ['./button-config.component.scss'],
  providers: [{ provide: MAT_CHIPS_DEFAULT_OPTIONS, useFactory: codesFactory }],
})
export class ButtonConfigComponent implements OnInit, OnDestroy {
  @Output() deleteButton: EventEmitter<boolean> = new EventEmitter();
  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];
  @Input() channels: Channel[] = [];
  @Input() relatedForms: Form[] = [];

  public targetResource?: Resource;
  public relatedResources: Resource[] = [];

  // Indicate is the page is a single dashboard.
  public isDashboard = false;

  // Indicate if the next step is a Form and so we could potentially pass some data to it.
  public canPassData = false;
  private workflowSubscription?: Subscription;

  // Emails
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;
  public emails: string[] = [];

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;

  /** @returns The list of fields which are of type scalar and not disabled */
  get scalarFields(): any[] {
    return this.fields.filter(
      (x) => x.type.kind === 'SCALAR' && !DISABLED_FIELDS.includes(x.name)
    );
  }

  /**
   * Configuration component for grid widget button.
   *
   * @param formBuilder Form builder
   * @param router Angular Router service
   * @param workflowService Shared workflow service
   * @param queryBuilder Shared Query Builder service
   * @param dialog Material dialog service
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private workflowService: SafeWorkflowService,
    private queryBuilder: QueryBuilderService,
    public dialog: MatDialog,
    private editorService: SafeEditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    if (
      this.router.url.includes('dashboard') &&
      !this.router.url.includes('workflow')
    ) {
      this.isDashboard = true;
    } else {
      const currentStepContent = this.router.url.split('/').pop();
      this.workflowSubscription = this.workflowService.workflow$.subscribe(
        (workflow) => {
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
        }
      );
    }

    this.formGroup?.get('prefillForm')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup
          ?.get('prefillTargetForm')
          ?.setValidators(Validators.required);
      } else {
        this.formGroup?.get('prefillTargetForm')?.clearValidators();
      }
      this.formGroup?.get('prefillTargetForm')?.updateValueAndValidity();
    });

    this.formGroup?.get('notify')?.valueChanges.subscribe((value) => {
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

    this.formGroup?.get('publish')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup
          ?.get('publicationChannel')
          ?.setValidators(Validators.required);
      } else {
        this.formGroup?.get('publicationChannel')?.clearValidators();
      }
      this.formGroup?.get('publicationChannel')?.updateValueAndValidity();
    });

    this.formGroup?.get('show')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.deleteInvalidModifications();
        this.formGroup?.controls.notify.setValue(false);
        this.formGroup?.controls.publish.setValue(false);
      }
    });

    this.formGroup
      ?.get('modifySelectedRows')
      ?.valueChanges.subscribe((value) => {
        if (!value) {
          this.deleteInvalidModifications();
        }
      });

    this.formGroup?.get('attachToRecord')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup?.get('targetForm')?.setValidators(Validators.required);
      } else {
        this.formGroup?.get('targetForm')?.clearValidators();
        this.formGroup?.get('targetForm')?.setValue(null);
      }
      this.formGroup?.get('targetForm')?.updateValueAndValidity();
    });

    this.formGroup?.get('sendMail')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup
          ?.get('distributionList')
          ?.setValidators(Validators.required);
        this.formGroup?.get('subject')?.setValidators(Validators.required);
      } else {
        this.formGroup?.get('distributionList')?.clearValidators();
        this.formGroup?.get('subject')?.clearValidators();
      }
      this.formGroup?.get('distributionList')?.updateValueAndValidity();
      this.formGroup?.get('subject')?.updateValueAndValidity();
    });

    this.emails = [...this.formGroup?.get('distributionList')?.value];

    this.formGroup?.get('targetResource')?.valueChanges.subscribe((value) => {
      if (value) {
        this.targetResource = this.relatedResources.find((x) => x.id === value);
        if (this.targetResource) {
          this.formGroup?.get('targetForm')?.setValidators(Validators.required);
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
      ?.valueChanges.subscribe((sendEmail: boolean) => {
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
      ?.valueChanges.subscribe((closeWorkflow: boolean) => {
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
      ?.valueChanges.subscribe((selectAll: boolean) => {
        if (selectAll) {
          this.formGroup?.controls.selectPage.setValue(false);
          this.formGroup?.get('selectPage')?.updateValueAndValidity();
        }
      });

    this.formGroup
      ?.get('selectPage')
      ?.valueChanges.subscribe((selectPage: boolean) => {
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
  get modificationsArray(): FormArray {
    return this.formGroup?.get('modifications') as FormArray;
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
      this.formBuilder.group({
        field: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  /**
   * Delete all the invalid modifications
   */
  private deleteInvalidModifications(): void {
    const modifications = this.formGroup?.get('modifications') as FormArray;
    for (let i = 0; i < modifications.value.length; i++) {
      const modification = modifications.at(i);
      if (modification.invalid) {
        modifications.removeAt(i);
        i--;
      }
    }
  }

  /**
   * Emit the event to delete the button
   */
  public emitDeleteButton(): void {
    this.deleteButton.emit(true);
  }

  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  add(event: MatChipInputEvent | any): void {
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const input =
          event.type === 'focusout'
            ? this.emailInput?.nativeElement
            : event.input;
        const value =
          event.type === 'focusout'
            ? this.emailInput?.nativeElement.value
            : event.value;

        // Add the mail
        if ((value || '').trim()) {
          this.emails.push(value.trim());
        }
        this.formGroup?.get('distributionList')?.setValue(this.emails);
        this.formGroup?.get('distributionList')?.updateValueAndValidity();
        // Reset the input value
        if (input) {
          input.value = '';
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  /**
   * Remove an email from the distribution list
   *
   * @param email The email to remove
   */
  remove(email: string): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
    this.formGroup?.get('distributionList')?.setValue(this.emails);
    this.formGroup?.get('distributionList')?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    if (this.workflowSubscription) {
      this.workflowSubscription.unsubscribe();
    }
  }
}
