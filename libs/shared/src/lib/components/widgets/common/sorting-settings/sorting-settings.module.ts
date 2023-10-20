import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SortingSettingsComponent } from './sorting-settings.component';
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
import { EmptyModule } from '../../../ui/empty/empty.module';

/**
 * Widget sorting settings module.
 * Used by grid & summary card widgets, to sort the data.
 */
@NgModule({
  declarations: [SortingSettingsComponent],
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
    EmptyModule,
  ],
  exports: [SortingSettingsComponent],
})
export class SortingSettingsModule {}
