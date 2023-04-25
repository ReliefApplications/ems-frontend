import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderModule } from '../../form-builder/form-builder.module';
import { SafeFilterBuilderComponent } from './filter-builder.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 *
 */
@NgModule({
  declarations: [SafeFilterBuilderComponent],
  imports: [
    CommonModule,
    SafeFormBuilderModule,
    SafeButtonModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [SafeFilterBuilderComponent],
})
export class SafeFilterBuilderModule {}
