import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderModule } from '../../form-builder/form-builder.module';
import { SafeFilterBuilderComponent } from './filter-builder.component';

/**
 *
 */
@NgModule({
  declarations: [SafeFilterBuilderComponent],
  imports: [CommonModule, SafeFormBuilderModule],
  exports: [SafeFilterBuilderComponent],
})
export class SafeFilterBuilderModule {}
