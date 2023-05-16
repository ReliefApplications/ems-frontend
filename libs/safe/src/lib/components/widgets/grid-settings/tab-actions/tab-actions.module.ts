import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleModule } from '@oort-front/ui';
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
    ToggleModule,
    SafeIconModule,
    TooltipModule,
  ],
  exports: [TabActionsComponent],
})
export class TabActionsModule {}
