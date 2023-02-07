import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';
import { SafeMapService } from './map.service';
import { SafeButtonModule } from '../../ui/button/public-api';
import { SafeDividerModule } from '../../ui/divider/public-api';

/** Module for the map widget component */
@NgModule({
  declarations: [SafeMapComponent, SafeMapPopupComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LayoutModule,
    SafeButtonModule,
    SafeDividerModule,
  ],
  exports: [SafeMapComponent],
  providers: [SafeMapService],
})
export class SafeMapModule {}
