import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationBuilderComponent } from './aggregation-builder.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFormsDropdownModule } from './forms-dropdown/forms-dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SafeAggregationBuilderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SafeFormsDropdownModule,
  ],
  exports: [SafeAggregationBuilderComponent],
})
export class SafeAggregationBuilderModule {}
