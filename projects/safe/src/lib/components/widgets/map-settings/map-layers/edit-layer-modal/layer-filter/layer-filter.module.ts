import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerFilterComponent } from './layer-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from 'projects/safe/src/lib/components/ui/button/button.module';
import { SafeIconModule } from 'projects/safe/src/lib/components/ui/icon/icon.module';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Module for the Layer Filter Component */
@NgModule({
  declarations: [SafeLayerFilterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeButtonModule,
    SafeIconModule,
    MatTooltipModule,
  ],
  exports: [SafeLayerFilterComponent],
})
export class SafeLayerFilterModule {}
