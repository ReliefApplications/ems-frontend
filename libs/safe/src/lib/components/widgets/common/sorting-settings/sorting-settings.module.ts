import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SafeSortingSettingsComponent } from './sorting-settings.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import {
  ButtonModule,
  IconModule,
  MenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { CdkTableModule } from '@angular/cdk/table';

/**
 * Module for the sorting-settings component
 */
@NgModule({
  declarations: [SafeSortingSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    IconModule,
    MenuModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    BrowserModule,
    InputsModule,
    DropDownsModule,
    TooltipModule,
    CdkTableModule,
  ],
  exports: [SafeSortingSettingsComponent],
})
export class SafeSortingSettingsModule {}
