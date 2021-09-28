import {Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { GetResourcesQueryResponse, GET_RESOURCES, GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  // === REACTIVE FORM ===
  addForm: FormGroup = new FormGroup({});

  // === DATA ===
  resources: any[] = [];
  templates: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddFormComponent>,
    private apollo: Apollo,
  ) { }

  /*  Load the resources and build the form.
  */
  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      binding: ['', Validators.required],
      resource: [null],
      inheritsTemplate: [false],
      template: [null]
    });

    this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES
    }).valueChanges.subscribe(res => {
      this.resources = res.data.resources.edges.map(x => x.node);
    });
  }

  /*  Called on resource input change.
    Load the templates linked to that resource.
  */
  getResource(e: any): void {
    this.apollo.query<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: e.value
      }
    }).subscribe(res => {
      this.templates = res.data.resource.forms || [];
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
