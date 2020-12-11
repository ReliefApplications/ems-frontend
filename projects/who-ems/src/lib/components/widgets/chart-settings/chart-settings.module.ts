import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartSettingsComponent } from './chart-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [WhoChartSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    TextFieldModule
  ],
  exports: [WhoChartSettingsComponent]
})
export class WhoChartSettingsModule { }
