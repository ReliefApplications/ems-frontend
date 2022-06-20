import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { MapPopupModule } from './map-popup/map-popup.module';

/** Module for the map widget component */
@NgModule({
  declarations: [SafeMapComponent],
  imports: [CommonModule, TranslateModule, LayoutModule, MapPopupModule],
  exports: [SafeMapComponent],
})
export class SafeMapModule {}
