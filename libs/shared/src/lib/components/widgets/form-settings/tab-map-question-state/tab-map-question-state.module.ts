import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMapQuestionStateComponent } from './tab-map-question-state.component';
import {
  ButtonModule,
  CheckboxModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
  TooltipModule,
  IconModule,
} from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { TranslateModule } from '@ngx-translate/core';
import { MapQuestionStateRuleComponent } from './map-question-state-rule/map-question-state-rule.component';

/**
 * Map question value to state tab of form settings modal.
 */
@NgModule({
  declarations: [TabMapQuestionStateComponent, MapQuestionStateRuleComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    SelectMenuModule,
    SpinnerModule,
    EmptyModule,
    CheckboxModule,
    FormWrapperModule,
    ButtonModule,
    TooltipModule,
    IconModule,
  ],
  exports: [TabMapQuestionStateComponent],
})
export class TabMapQuestionStateModule {}
