import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipelineComponent } from './pipeline.component';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeButtonModule } from '../../button/button.module';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [SafePipelineComponent],
  imports: [
    CommonModule,
    SafeQueryBuilderModule,
    SafeButtonModule,
    MatMenuModule,
    TranslateModule,
    MatExpansionModule,
  ],
  exports: [SafePipelineComponent],
})
export class SafePipelineModule {}
