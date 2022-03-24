import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeAggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';

@NgModule({
  declarations: [SafeSchedulerSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    MatSelectModule,
    TranslateModule,
    SafeAggregationBuilderModule
  ],
  exports: [SafeSchedulerSettingsComponent],
})
export class SafeSchedulerSettingsModule {}
