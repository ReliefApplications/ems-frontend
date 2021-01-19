import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { Channel, Form } from '@who-ems/builder';
import { Observable } from 'rxjs';
import { GetFormsQueryResponse, GET_FORMS } from '../../../../../graphql/queries';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})
export class AddSubscriptionComponent implements OnInit {

  // === REACTIVE FORM ===
  subscriptionForm: FormGroup;

  // === DATA ===
  public forms: Form[];
  public filteredForms: Observable<Form[]>;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddSubscriptionComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: {
      channels: Channel[];
    }
  ) { }

  ngOnInit(): void {
    this.subscriptionForm = this.formBuilder.group({
      routingKey: ['', Validators.required],
      convertTo: [''],
      channel: ['']
    });
    this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS
    }).valueChanges.subscribe(res => {
      this.forms = res.data.forms;
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

}
