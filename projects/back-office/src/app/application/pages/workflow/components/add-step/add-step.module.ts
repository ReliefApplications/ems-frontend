import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStepRoutingModule } from './add-step-routing.module';
import { AddStepComponent } from './add-step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import {
  SafeButtonModule,
  SafeContentChoiceModule,
  SafeFormsDropdownModule,
  SafeDividerModule,
} from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';

/**
 * Add step module
 */
@NgModule({
  declarations: [AddStepComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    AddStepRoutingModule,
    MatRippleModule,
    SafeButtonModule,
    SafeContentChoiceModule,
    TranslateModule,
    SafeFormsDropdownModule,
    SafeDividerModule,
    AbilityModule,
  ],
})
export class AddStepModule {}
