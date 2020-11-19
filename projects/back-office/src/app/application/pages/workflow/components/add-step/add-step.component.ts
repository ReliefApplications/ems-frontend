import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentType, Form } from '@who-ems/builder';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetFormsQueryResponse, GET_FORMS } from '../../../../../graphql/queries';
import { WorkflowService } from '../../../../../services/workflow.service';

@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.scss']
})
export class AddStepComponent implements OnInit {

  // === DATA ===
  public contentTypes = Object.keys(ContentType).filter((key) => key !== ContentType.workflow);
  public forms: Form[];

  // === REACTIVE FORM ===
  public stepForm: FormGroup;
  public showContent = false;
  public stage = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private workflowServive: WorkflowService,
  ) { }

  ngOnInit(): void {
    this.stepForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      content: [''],
    });
    this.stepForm.get('type').valueChanges.subscribe(type => {
      const contentControl = this.stepForm.controls.content;
      if (type === ContentType.form) {
        this.apollo.watchQuery<GetFormsQueryResponse>({
          query: GET_FORMS,
        }).valueChanges.subscribe((res) => {
          this.forms = res.data.forms;
          contentControl.setValidators([Validators.required]);
          contentControl.updateValueAndValidity();
          this.showContent = true;
        });
      } else {
        contentControl.setValidators(null);
        contentControl.setValue(null);
        contentControl.updateValueAndValidity();
        this.showContent = false;
      }
    });
  }

  isStageValid(stage: number): boolean {
    switch (stage) {
      case 1: {
        return this.stepForm.controls.name.valid;
      }
      case 2: {
        return this.stepForm.controls.type.valid;
      }
      case 3: {
        return this.stepForm.controls.content.valid;
      }
      default: {
        return true;
      }
    }
  }

  onSubmit(): void {
    this.workflowServive.addStep(this.stepForm.value, this.route);
  }

  onBack(): void {
    this.stage -= 1;
  }

  onNext(): void {
    switch (this.stage) {
      case 1: {
        this.stage += 1;
        break;
      }
      case 2: {
        this.stepForm.controls.type.value === ContentType.form ? this.stage += 1 : this.onSubmit();
        break;
      }
      case 3: {
        this.onSubmit();
        break;
      }
      default: {
        this.stage += 1;
        break;
      }
    }
  }

}
