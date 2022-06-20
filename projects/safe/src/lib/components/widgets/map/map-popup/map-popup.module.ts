import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPopupComponent } from './map-popup.component';

/**
 * Map Popup module.
 */
@NgModule({
  declarations: [MapPopupComponent],
  imports: [CommonModule],
  exports: [MapPopupComponent],
})
export class MapPopupModule {}
