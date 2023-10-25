import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ToggleModule,
  TooltipModule,
  FormWrapperModule,
  IconModule,
  DividerModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDisplayTabComponent } from './display-tab.component';

/** Display tab Module for summary card edition */
@NgModule({
  declarations: [SafeDisplayTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    DividerModule,
    TooltipModule,
    ToggleModule,
    IconModule,
    DividerModule,
  ],
  exports: [SafeDisplayTabComponent],
})
export class SafeDisplayTabModule {}
