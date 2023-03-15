import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPopupComponent } from './layer-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Map layer properties popup module.
 */
@NgModule({
  declarations: [LayerPopupComponent],
  imports: [CommonModule, DragDropModule, SafeButtonModule, TranslateModule],
  exports: [LayerPopupComponent],
})
export class LayerPopupModule {}
