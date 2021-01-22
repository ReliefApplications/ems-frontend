import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStepRoutingModule } from './add-step-routing.module';
import { AddStepComponent } from './add-step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [AddStepComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    AddStepRoutingModule
  ]
})
export class AddStepModule { }
