import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule, ToggleModule, TooltipModule } from '@oort-front/ui';

/**
 * Actions tab of grid widget configuration modal.
 */
@NgModule({
  declarations: [TabActionsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleModule,
    IconModule,
    TooltipModule,
  ],
  exports: [TabActionsComponent],
})
export class TabActionsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormWrapperModule,
  IconModule,
  ToggleModule,
  TooltipModule,
  SelectMenuModule,
  CheckboxModule,
} from '@oort-front/ui';

/**
 * Actions tab of grid widget configuration modal.
 */
@NgModule({
  declarations: [TabActionsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ToggleModule,
    IconModule,
    TooltipModule,
    SelectMenuModule,
    CheckboxModule,
  ],
  exports: [TabActionsComponent],
})
export class TabActionsModule {}
