import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModalComponent } from './icon-modal.component';
import { DividerModule, FormWrapperModule, UiModule } from '@oort-front/ui';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IconPickerModule } from '../icon-picker/icon-picker.module';
import { InputsModule, SliderModule } from '@progress/kendo-angular-inputs';

/**
 * Module for the icon modal component
 */
@NgModule({
  declarations: [IconModalComponent],
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    InputsModule,
    IconPickerModule,
    SliderModule,
    DividerModule,
  ],
})
export class IconModalModule {}
