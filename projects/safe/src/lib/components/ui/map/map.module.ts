import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';

/** Module for the map UI component */
@NgModule({
  declarations: [SafeMapComponent, SafeMapPopupComponent],
  imports: [CommonModule, TranslateModule, LayoutModule],
  exports: [SafeMapComponent],
})
export class SafeMapModule {}
