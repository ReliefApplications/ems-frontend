import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';
import { GroupedPointsPopupModule } from './grouped-points-popup/grouped-points-popup.module';

/** Module for the map widget component */
@NgModule({
  declarations: [SafeMapComponent, SafeMapPopupComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LayoutModule,
    GroupedPointsPopupModule,
  ],
  exports: [SafeMapComponent],
})
export class SafeMapModule {}
