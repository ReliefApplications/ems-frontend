import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { SafeFilteringSettingsComponent } from './filtering-settings.component';

/**
 * Module for the filtering-settings component
 */
@NgModule({
  declarations: [SafeFilteringSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
  ],
  exports: [SafeFilteringSettingsComponent],
})
export class SafeFilteringSettingsModule {}
