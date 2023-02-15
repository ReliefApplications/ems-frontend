import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';

/** Module for the map UI component */
@NgModule({
  declarations: [SafeMapComponent, SafeMapPopupComponent],
  imports: [CommonModule, TranslateModule],
  exports: [SafeMapComponent],
})
export class SafeMapModule {}
