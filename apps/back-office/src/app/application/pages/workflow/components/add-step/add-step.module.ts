import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStepRoutingModule } from './add-step-routing.module';
import { AddStepComponent } from './add-step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SafeContentChoiceModule,
  SafeFormsDropdownModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { DividerModule, ButtonModule } from '@oort-front/ui';

/**
 * Add step module
 */
@NgModule({
  declarations: [AddStepComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddStepRoutingModule,
    SafeContentChoiceModule,
    TranslateModule,
    SafeFormsDropdownModule,
    DividerModule,
    AbilityModule,
    ButtonModule,
  ],
})
export class AddStepModule {}
