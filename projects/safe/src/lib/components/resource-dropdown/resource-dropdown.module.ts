import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceDropdownComponent } from './resource-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    SafeResourceDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    SafeResourceDropdownComponent
  ]
})
export class SafeResourceDropdownModule { }
