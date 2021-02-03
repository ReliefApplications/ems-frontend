import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { Application, Channel, Form } from '@who-ems/builder';
import { Observable } from 'rxjs';
import { GetFormsQueryResponse, GetRoutingKeysQueryResponse, GET_FORMS, GET_ROUTING_KEYS } from '../../../../../graphql/queries';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-subscription',
  templateUrl: './edit-subscription.component.html',
  styleUrls: ['./edit-subscription.component.scss']
})
export class EditSubscriptionComponent implements OnInit {

   // === REACTIVE FORM ===
   subscriptionForm: FormGroup;

   // === DATA ===
   public forms: Form[];
   // === DATA ===
   private applications: Application[];
   public filteredApplications: Observable<Application[]>;
   public dataIn;

   get routingKey(): string {
     return this.subscriptionForm.value.routingKey;
   }

   set routingKey(value: string) {
     this.subscriptionForm.controls.routingKey.setValue(value);
   }
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditSubscriptionComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dataIn = data.data;
  }

  ngOnInit(): void {
    this.subscriptionForm = this.formBuilder.group({
      routingKey: [this.dataIn.routingKey, Validators.required],
      title: [this.dataIn.title, Validators.required],
      convertTo: [this.dataIn.convertTo?.id ? this.dataIn.convertTo.id : ''],
      channel: [this.dataIn.channel?.id ? this.dataIn.channel.id : '']
    });
    this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS
    }).valueChanges.subscribe(res => {
      this.forms = res.data.forms;
    });
    this.apollo.watchQuery<GetRoutingKeysQueryResponse>({
      query: GET_ROUTING_KEYS
    }).valueChanges.subscribe(res => {
      this.applications = res.data.applications.filter(x => x.channels.length > 0);
    });
    this.filteredApplications = this.subscriptionForm.controls.routingKey.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(x => this.filter(x))
    );
  }

  private filter(value: string): Application[] {
    const filterValue = value.toLowerCase();
    return this.applications ? this.applications.filter(x => x.name.toLowerCase().indexOf(filterValue) === 0) : this.applications;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
