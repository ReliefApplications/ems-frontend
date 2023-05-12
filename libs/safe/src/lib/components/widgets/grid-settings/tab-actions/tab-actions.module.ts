import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { UiModule } from '@oort-front/ui';

/**
 * Actions tab of grid widget configuration modal.
 */
@NgModule({
  declarations: [TabActionsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    UiModule,
    MatTooltipModule,
  ],
  exports: [TabActionsComponent],
})
export class TabActionsModule {}
