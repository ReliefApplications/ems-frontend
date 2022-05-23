import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Channel } from '../../../../models/channel.model';
import { Form } from '../../../../models/form.model';
import { ContentType } from '../../../../models/page.model';
import { SafeWorkflowService } from '../../../../services/workflow.service';
import { Subscription } from 'rxjs';
import {
  MatChipInputEvent,
  MAT_CHIPS_DEFAULT_OPTIONS,
} from '@angular/material/chips';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { SafeQueryBuilderComponent } from '../../../query-builder/query-builder.component';
import { QueryBuilderService } from '../../../../services/query-builder.service';
import { MatDialog } from '@angular/material/dialog';
import {
  EMAIL_EDITOR_CONFIG,
  EDITOR_LANGUAGE_PAIRS,
} from '../../../../const/tinymce.const';
import { TranslateService } from '@ngx-translate/core';

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];
const SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function codesFactory(): () => any {
  const codes = () => ({ separatorKeyCodes: SEPARATOR_KEYS_CODE });
  return codes;
}

@Component({
  selector: 'safe-floating-button-settings',
  templateUrl: './floating-button-settings.component.html',
  styleUrls: ['./floating-button-settings.component.scss'],
  providers: [{ provide: MAT_CHIPS_DEFAULT_OPTIONS, useFactory: codesFactory }],
})
export class SafeFloatingButtonSettingsComponent implements OnInit, OnDestroy {
  @Output() deleteButton: EventEmitter<boolean> = new EventEmitter();
  @Input() buttonForm?: FormGroup;
  @Input() fields: any[] = [];
  @Input() channels: Channel[] = [];
  @Input() relatedForms: Form[] = [];

  // Indicate is the page is a single dashboard.
  public isDashboard = false;

  // Indicate if the next step is a Form and so we could potentially pass some data to it.
  public canPassData = false;
  private workflowSubscription?: Subscription;

  // Emails
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;
  public emails: string[] = [];
  public factory?: ComponentFactory<any>;

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;

  get scalarFields(): any[] {
    return this.fields.filter(
      (x) => x.type.kind === 'SCALAR' && !DISABLED_FIELDS.includes(x.name)
    );
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private workflowService: SafeWorkflowService,
    private queryBuilder: QueryBuilderService,
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    // Set the editor language
    const lang = this.translate.currentLang;
    const editorLang = EDITOR_LANGUAGE_PAIRS.find((x) => x.key === lang);
    if (editorLang) {
      this.editor.language = editorLang.tinymceKey;
    } else {
      this.editor.language = 'en';
    }
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

    this.buttonForm?.get('prefillForm')?.valueChanges.subscribe((value) => {
      if (value) {
        this.buttonForm
          ?.get('prefillTargetForm')
          ?.setValidators(Validators.required);
      } else {
        this.buttonForm?.get('prefillTargetForm')?.clearValidators();
      }
      this.buttonForm?.get('prefillTargetForm')?.updateValueAndValidity();
    });

    this.buttonForm?.get('notify')?.valueChanges.subscribe((value) => {
      if (value) {
        this.buttonForm
          ?.get('notificationChannel')
          ?.setValidators(Validators.required);
        this.buttonForm
          ?.get('notificationMessage')
          ?.setValidators(Validators.required);
      } else {
        this.buttonForm?.get('notificationChannel')?.clearValidators();
        this.buttonForm?.get('notificationMessage')?.clearValidators();
      }
      this.buttonForm?.get('notificationChannel')?.updateValueAndValidity();
      this.buttonForm?.get('notificationMessage')?.updateValueAndValidity();
    });

    this.buttonForm?.get('publish')?.valueChanges.subscribe((value) => {
      if (value) {
        this.buttonForm
          ?.get('publicationChannel')
          ?.setValidators(Validators.required);
      } else {
        this.buttonForm?.get('publicationChannel')?.clearValidators();
      }
      this.buttonForm?.get('publicationChannel')?.updateValueAndValidity();
    });

    this.buttonForm?.get('show')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.deleteInvalidModifications();
        this.buttonForm?.controls.notify.setValue(false);
        this.buttonForm?.controls.publish.setValue(false);
      }
    });

    this.buttonForm
      ?.get('modifySelectedRows')
      ?.valueChanges.subscribe((value) => {
        if (!value) {
          this.deleteInvalidModifications();
        }
      });

    this.buttonForm?.get('attachToRecord')?.valueChanges.subscribe((value) => {
      if (value) {
        this.buttonForm?.get('targetForm')?.setValidators(Validators.required);
      } else {
        this.buttonForm?.get('targetForm')?.clearValidators();
        this.buttonForm?.get('targetForm')?.setValue(null);
      }
      this.buttonForm?.get('targetForm')?.updateValueAndValidity();
    });

    this.buttonForm?.get('targetForm')?.valueChanges.subscribe((value) => {
      if (value) {
        this.buttonForm
          ?.get('targetFormField')
          ?.setValidators(Validators.required);
      } else {
        this.buttonForm?.get('targetFormField')?.clearValidators();
        this.buttonForm?.get('targetFormField')?.setValue(null);
      }
      this.buttonForm?.get('targetFormField')?.updateValueAndValidity();
    });

    this.buttonForm?.get('sendMail')?.valueChanges.subscribe((value) => {
      if (value) {
        this.buttonForm
          ?.get('distributionList')
          ?.setValidators(Validators.required);
        this.buttonForm?.get('subject')?.setValidators(Validators.required);
      } else {
        this.buttonForm?.get('distributionList')?.clearValidators();
        this.buttonForm?.get('subject')?.clearValidators();
      }
      this.buttonForm?.get('distributionList')?.updateValueAndValidity();
      this.buttonForm?.get('subject')?.updateValueAndValidity();
    });

    this.emails = [...this.buttonForm?.get('distributionList')?.value];

    this.buttonForm?.get('targetForm')?.valueChanges.subscribe((target) => {
      if (target?.name) {
        const queryName = this.queryBuilder.getQueryNameFromResourceName(
          target?.name || ''
        );
        this.buttonForm?.get('targetFormQuery.name')?.setValue(queryName);
        this.buttonForm
          ?.get('targetFormQuery.fields')
          ?.setValidators([Validators.required]);
      } else {
        this.buttonForm?.get('targetFormQuery')?.clearValidators();
      }
      this.buttonForm?.get('targetFormQuery')?.updateValueAndValidity();
    });

    this.buttonForm
      ?.get('sendMail')
      ?.valueChanges.subscribe((sendEmail: boolean) => {
        if (sendEmail) {
          this.buttonForm
            ?.get('bodyFields')
            ?.setValidators([Validators.required]);
        } else {
          this.buttonForm?.get('bodyFields')?.clearValidators();
        }
        this.buttonForm?.get('bodyFields')?.updateValueAndValidity();
      });

    this.buttonForm
      ?.get('closeWorkflow')
      ?.valueChanges.subscribe((closeWorkflow: boolean) => {
        if (closeWorkflow) {
          this.buttonForm
            ?.get('confirmationText')
            ?.setValidators([Validators.required]);
        } else {
          this.buttonForm?.get('confirmationText')?.clearValidators();
        }
        this.buttonForm?.get('confirmationText')?.updateValueAndValidity();
      });

    this.buttonForm
      ?.get('selectAll')
      ?.valueChanges.subscribe((selectAll: boolean) => {
        if (selectAll) {
          this.buttonForm?.controls.selectPage.setValue(false);
          this.buttonForm?.get('selectPage')?.updateValueAndValidity();
        }
      });

    this.buttonForm
      ?.get('selectPage')
      ?.valueChanges.subscribe((selectPage: boolean) => {
        if (selectPage) {
          this.buttonForm?.controls.selectAll.setValue(false);
          this.buttonForm?.get('selectAll')?.updateValueAndValidity();
        }
      });

    this.factory = this.componentFactoryResolver.resolveComponentFactory(
      SafeQueryBuilderComponent
    );
  }

  compareFields(field1: any, field2: any): boolean {
    if (field2) {
      return field1.name === field2.name;
    } else {
      return false;
    }
  }

  get modificationsArray(): FormArray {
    return this.buttonForm?.get('modifications') as FormArray;
  }

  onDeleteModification(index: number): void {
    this.modificationsArray.removeAt(index);
  }

  onAddModification(): void {
    this.modificationsArray.push(
      this.formBuilder.group({
        field: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  private deleteInvalidModifications(): void {
    const modifications = this.buttonForm?.get('modifications') as FormArray;
    for (let i = 0; i < modifications.value.length; i++) {
      const modification = modifications.at(i);
      if (modification.invalid) {
        modifications.removeAt(i);
        i--;
      }
    }
  }

  public emitDeleteButton(): void {
    this.deleteButton.emit(true);
  }

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
        this.buttonForm?.get('distributionList')?.setValue(this.emails);
        this.buttonForm?.get('distributionList')?.updateValueAndValidity();
        // Reset the input value
        if (input) {
          input.value = '';
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
    this.buttonForm?.get('distributionList')?.setValue(this.emails);
    this.buttonForm?.get('distributionList')?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    if (this.workflowSubscription) {
      this.workflowSubscription.unsubscribe();
    }
  }
}
