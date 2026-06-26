import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStepRoutingModule } from './add-step-routing.module';
import { AddStepComponent } from './add-step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentChoiceModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { AblePipe } from '@casl/angular';
import {
  DividerModule,
  ButtonModule,
  GraphQLSelectModule,
  FormWrapperModule,
} from '@oort-front/ui';

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
    ContentChoiceModule,
    TranslateModule,
    DividerModule,
    AblePipe,
    ButtonModule,
    GraphQLSelectModule,
    FormWrapperModule,
  ],
})
export class AddStepModule {}
