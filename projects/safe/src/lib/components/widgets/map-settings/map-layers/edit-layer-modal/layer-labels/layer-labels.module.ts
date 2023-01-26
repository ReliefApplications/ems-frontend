import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerLabelsComponent } from './layer-labels.component';
import { SafeButtonModule } from 'projects/safe/src/lib/components/ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the Layer Labels Component */
@NgModule({
  declarations: [SafeLayerLabelsComponent],
  imports: [CommonModule, TranslateModule, SafeButtonModule],
  exports: [SafeLayerLabelsComponent],
})
export class SafeLayerLabelsModule {}
