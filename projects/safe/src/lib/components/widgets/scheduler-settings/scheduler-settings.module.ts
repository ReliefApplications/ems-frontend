import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [SafeSchedulerSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  exports: [SafeSchedulerSettingsComponent]
})
export class SafeSchedulerSettingsModule { }
