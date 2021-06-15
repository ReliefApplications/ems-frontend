import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiConfiguration, Channel, Form, PullJob, status } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { GetApiConfigurationsQueryResponse, GetFormsQueryResponse, GET_API_CONFIGURATIONS, GET_FORM_NAMES } from 'projects/back-office/src/app/graphql/queries';
import { SubscriptionModalComponent } from '../../../subscriptions/components/subscription-modal/subscription-modal.component';
@Component({
  selector: 'app-pull-job-modal',
  templateUrl: './pull-job-modal.component.html',
  styleUrls: ['./pull-job-modal.component.scss']
})
export class PullJobModalComponent implements OnInit {

  // === REACTIVE FORM ===
  pullJobForm: FormGroup = new FormGroup({});

  // === DATA ===
  public forms: Form[] = [];
  public apiConfigurations: ApiConfiguration[] = [];
  public statusChoices = Object.values(status);

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SubscriptionModalComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: {
      channels: Channel[];
      pullJob?: PullJob
    }
  ) { }

  ngOnInit(): void {
    this.pullJobForm = this.formBuilder.group({
      name: [this.data.pullJob ? this.data.pullJob.name : '', Validators.required],
      status: [this.data.pullJob ? this.data.pullJob.status : '', Validators.required],
      apiConfiguration: [(this.data.pullJob && this.data.pullJob.apiConfiguration)
        ? this.data.pullJob.apiConfiguration.id : '', Validators.required],
      schedule: [this.data.pullJob ? this.data.pullJob.schedule : ''],
      convertTo: [(this.data.pullJob && this.data.pullJob.convertTo) ? this.data.pullJob.convertTo.id : ''],
      mapping: [this.data.pullJob ? this.data.pullJob.mapping : ''],
      channel: [(this.data.pullJob && this.data.pullJob.channel) ? this.data.pullJob.channel.id : ''],
    });
    this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORM_NAMES
    }).valueChanges.subscribe((res: any) => {
      this.forms = res.data.forms;
    });
    this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
      query: GET_API_CONFIGURATIONS
    }).valueChanges.subscribe( res => {
      if (res) {
        this.apiConfigurations = res.data.apiConfigurations;
      }
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
