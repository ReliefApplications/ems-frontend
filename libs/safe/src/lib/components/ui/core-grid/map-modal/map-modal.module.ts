import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal.component';

/**
 * Modal to display the map
 */
@NgModule({
  declarations: [MapModalComponent],
  imports: [CommonModule],
  exports: [MapModalComponent],
})
export class MapModalModule {}
