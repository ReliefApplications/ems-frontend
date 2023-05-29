import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import { DialogRef } from '@angular/cdk/dialog';
import { ButtonModule } from '@oort-front/ui';
import { FormWrapperModule } from '@oort-front/ui';

/**
 * Modal to add a new resource.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormWrapperModule,
    MatButtonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
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
    public dialogRef: DialogRef<AddResourceModalComponent>
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
