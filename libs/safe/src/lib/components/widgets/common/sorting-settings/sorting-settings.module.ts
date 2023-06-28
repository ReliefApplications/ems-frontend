import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { SafeSortingSettingsComponent } from './sorting-settings.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from '@oort-front/ui';

/**
 * Module for the sorting-settings component
 */
@NgModule({
  declarations: [SafeSortingSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    InputsModule,
    DropDownsModule,
    MatTooltipModule,
  ],
  exports: [SafeSortingSettingsComponent],
})
export class SafeSortingSettingsModule {}
