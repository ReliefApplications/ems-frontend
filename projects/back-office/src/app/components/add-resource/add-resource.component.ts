import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Modal to add a new resource.
 */
@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss'],
})
export class AddResourceComponent implements OnInit {
  public addForm: FormGroup = new FormGroup({});

  /**
   * Modal to add a new resource.
   *
   * @param formBuilder Angular Form builder service
   * @param dialogRef Dialog reference
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddResourceComponent>
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
