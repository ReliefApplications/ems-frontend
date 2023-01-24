import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

/**
 * Modal to add a new resource.
 */
@Component({
  selector: 'app-add-resource-modal',
  templateUrl: './add-resource-modal.component.html',
  styleUrls: ['./add-resource-modal.component.scss'],
})
export class AddResourceModalComponent implements OnInit {
  public addForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Modal to add a new resource.
   *
   * @param formBuilder Angular Form builder service
   * @param dialogRef Dialog reference
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddResourceModalComponent>
  ) {}

  /**
   * Loads the resources and build the form.
   */
  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
