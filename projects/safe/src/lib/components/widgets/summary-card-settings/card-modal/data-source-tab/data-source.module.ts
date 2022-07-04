import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAggregationBuilderModule } from '../../../../ui/aggregation-builder/aggregation-builder.module';
import { SafeDataSourceTabComponent } from './data-source-tab.component';

/** Data Source Module */
@NgModule({
  declarations: [SafeDataSourceTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatRadioModule,
    SafeAggregationBuilderModule
  ],
  exports: [SafeDataSourceTabComponent],
})
export class SafeDataSourceTabModule {}
