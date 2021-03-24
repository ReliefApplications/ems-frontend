import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartSettingsComponent } from './chart-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WhoQueryBuilderModule } from '../../query-builder/query-builder.module';
import { WhoChartModule } from '../chart/chart.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatButtonModule,
    MatIconModule,
    TextFieldModule,
    WhoQueryBuilderModule,
    WhoChartModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  exports: [WhoChartSettingsComponent]
})
export class WhoChartSettingsModule { }
