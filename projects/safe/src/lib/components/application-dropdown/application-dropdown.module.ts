import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationDropdownComponent } from './application-dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from 'projects/back-office/src/app/dashboard/pages/forms/forms.module';

@NgModule({
  declarations: [
    SafeApplicationDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    SafeApplicationDropdownComponent
  ]
})
export class SafeApplicationDropdownModule { }
