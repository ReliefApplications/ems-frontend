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
import { SafeButtonModule, SafeContentChoiceModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';

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
  ],
})
export class AddStepModule {}
