import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { GroupedPointsPopupComponent } from './grouped-points-popup.component';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the GroupedPointsPopupComponent */
@NgModule({
  declarations: [GroupedPointsPopupComponent],
  imports: [CommonModule, TranslateModule, SafeButtonModule, SafeDividerModule],
  exports: [GroupedPointsPopupComponent],
})
export class GroupedPointsPopupModule {}
