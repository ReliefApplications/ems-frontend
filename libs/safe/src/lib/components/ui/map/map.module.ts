import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';

/** Module for the map UI component */
@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, TranslateModule, SafeMapPopupComponent],
  exports: [MapComponent],
})
export class MapModule {}
