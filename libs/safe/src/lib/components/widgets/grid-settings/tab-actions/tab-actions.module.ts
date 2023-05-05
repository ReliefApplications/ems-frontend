import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { TooltipModule } from '@oort-front/ui';

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
    SafeIconModule,
    TooltipModule,
  ],
  exports: [TabActionsComponent],
})
export class TabActionsModule {}
