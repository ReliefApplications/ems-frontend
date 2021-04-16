import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Channel } from 'projects/safe/src/lib/models/channel.model';
import { Form } from 'projects/safe/src/lib/models/form.model';
import { ContentType } from 'projects/safe/src/lib/models/page.model';
import { SafeWorkflowService } from '../../../../services/workflow.service';
import { Subscription } from 'rxjs';

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

@Component({
  selector: 'safe-floating-button-settings',
  templateUrl: './floating-button-settings.component.html',
  styleUrls: ['./floating-button-settings.component.scss']
})
export class FloatingButtonSettingsComponent implements OnInit, OnDestroy {

  @Output() deleteButton: EventEmitter<boolean> = new EventEmitter();
  @Input() buttonForm: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() channels: Channel[] = [];
  @Input() forms: Form[] = [];
  @Input() relatedForms: Form[] = [];

  // Indicate is the page is a single dashboard.
  public isDashboard = false;

  // Indicate if the next step is a Form and so we could potentially pass some data to it.
  public canPassData = false;
  private workflowSubscription?: Subscription;

  get scalarFields(): any[] {
    return this.fields.filter(x => x.type.kind === 'SCALAR' && !DISABLED_FIELDS.includes(x.name));
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private workflowService: SafeWorkflowService,
  ) { }

  ngOnInit(): void {
    if (this.router.url.includes('dashboard') && !this.router.url.includes('workflow')) {
      this.isDashboard = true;
    } else {
      const currentStepContent = this.router.url.split('/').pop();
      this.workflowSubscription = this.workflowService.workflow.subscribe(workflow => {
        if (workflow) {
          const steps = workflow.steps || [];
          const currentStepIndex = steps.findIndex(x => x.content === currentStepContent);
          if (currentStepIndex >= 0) {
            const nextStep = steps[currentStepIndex + 1];
            this.canPassData = nextStep && nextStep.type === ContentType.form;
          }
        } else {
          const workflowId = this.router.url.split('/workflow/').pop()?.split('/').shift();
          this.workflowService.loadWorkflow(workflowId);
        }
      });
    }
    this.buttonForm.get('notify')?.valueChanges.subscribe(value => {
      if (value) {
        this.buttonForm.get('notificationChannel')?.setValidators(Validators.required);
        this.buttonForm.get('notificationMessage')?.setValidators(Validators.required);
      } else {
        this.buttonForm.get('notificationChannel')?.clearValidators();
        this.buttonForm.get('notificationMessage')?.clearValidators();
      }
      this.buttonForm.get('notificationChannel')?.updateValueAndValidity();
      this.buttonForm.get('notificationMessage')?.updateValueAndValidity();
    });

    this.buttonForm.get('publish')?.valueChanges.subscribe(value => {
      if (value) {
        this.buttonForm.get('publicationChannel')?.setValidators(Validators.required);
      } else {
        this.buttonForm.get('publicationChannel')?.clearValidators();
      }
      this.buttonForm.get('publicationChannel')?.updateValueAndValidity();
    });

    this.buttonForm.get('show')?.valueChanges.subscribe(value => {
      if (!value) {
        this.deleteInvalidModifications();
        this.buttonForm.controls.notify.setValue(false);
        this.buttonForm.controls.publish.setValue(false);
      }
    });

    this.buttonForm.get('modifySelectedRows')?.valueChanges.subscribe(value => {
      if (!value) {
        this.deleteInvalidModifications();
      }
    });

    this.buttonForm.get('attachToRecord')?.valueChanges.subscribe(value => {
      if (value) {
        this.buttonForm.get('targetForm')?.setValidators(Validators.required);
      } else {
        this.buttonForm.get('targetForm')?.clearValidators();
        this.buttonForm.get('targetForm')?.setValue(null);
      }
      this.buttonForm.get('targetForm')?.updateValueAndValidity();
    });

    this.buttonForm.get('targetForm')?.valueChanges.subscribe(value => {
      if (value) {
        this.buttonForm.get('targetFormField')?.setValidators(Validators.required);
      } else {
        this.buttonForm.get('targetFormField')?.clearValidators();
        this.buttonForm.get('targetFormField')?.setValue(null);
      }
      this.buttonForm.get('targetFormField')?.updateValueAndValidity();
    });
  }

  compareFields(field1: any, field2: any): boolean {
    if (field2) {
      return field1.name === field2.name;
    } else {
      return false;
    }
  }

  get modificationsArray(): FormArray {
    return this.buttonForm.get('modifications') as FormArray;
  }

  onDeleteModification(index: number): void {
    this.modificationsArray.removeAt(index);
  }

  onAddModification(): void {
    this.modificationsArray.push(this.formBuilder.group({
      field: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  private deleteInvalidModifications(): void {
    const modifications = this.buttonForm.get('modifications') as FormArray;
    for (let i = 0; i < modifications.value.length; i ++) {
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

  ngOnDestroy(): void {
    if (this.workflowSubscription) {
      this.workflowSubscription.unsubscribe();
    }
  }
}
