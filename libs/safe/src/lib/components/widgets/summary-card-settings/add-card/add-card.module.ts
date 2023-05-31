import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAddCardComponent } from './add-card.component';
import { MatRippleModule } from '@angular/material/core';
import { SafeCardTemplateComponent } from './card-template/card-template.component';
import { SafeSkeletonModule } from '../../../../directives/skeleton/skeleton.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SpinnerModule,
  FormWrapperModule,
  IconModule,
  AlertModule,
  DividerModule,
  DialogModule,
  TooltipModule,
  RadioModule,
  ButtonModule,
} from '@oort-front/ui';

/** Module to add new card in summary card widget */
@NgModule({
  declarations: [SafeAddCardComponent, SafeCardTemplateComponent],
  imports: [
    CommonModule,
    TooltipModule,
    TranslateModule,
    DividerModule,
    DialogModule,
    MatRippleModule,
    SafeSkeletonModule,
    IndicatorsModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    FormWrapperModule,
    IconModule,
    RadioModule,
    ButtonModule,
    AlertModule,
  ],
  exports: [SafeAddCardComponent, SafeCardTemplateComponent],
})
export class SafeAddCardModule {}
