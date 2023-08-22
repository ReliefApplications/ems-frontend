import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SafeSortingSettingsComponent } from './sorting-settings.component';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  SelectMenuModule,
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
    TooltipModule,
    CdkTableModule,
    FormWrapperModule,
    SelectMenuModule,
  ],
  exports: [SafeSortingSettingsComponent],
})
export class SafeSortingSettingsModule {}
