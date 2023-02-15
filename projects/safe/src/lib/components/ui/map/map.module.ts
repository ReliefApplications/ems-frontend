import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';
import { SafeButtonModule } from '../button/button.module';
import { SafeDividerModule } from '../divider/divider.module';

/** Module for the map UI component */
@NgModule({
  declarations: [SafeMapComponent, SafeMapPopupComponent],
  imports: [CommonModule, TranslateModule, SafeButtonModule, SafeDividerModule],
  exports: [SafeMapComponent],
})
export class SafeMapModule {}
