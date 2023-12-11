import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    FormWrapperModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'app-add-resource-modal',
  templateUrl: './add-resource-modal.component.html',
  styleUrls: ['./add-resource-modal.component.scss'],
})
export class AddResourceModalComponent {
  public addForm = this.fb.group({
    name: ['', Validators.required],
  });

  /**
   * Modal to add a new resource.
   *
   * @param fb Angular Form builder service
   * @param dialogRef Dialog reference
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddResourceModalComponent>
  ) {}
}
