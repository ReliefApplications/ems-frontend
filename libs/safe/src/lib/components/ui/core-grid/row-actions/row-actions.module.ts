import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridRowActionsComponent } from './row-actions.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MenuModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the grid row actions component */
@NgModule({
  declarations: [SafeGridRowActionsComponent],
  imports: [CommonModule, ButtonModule, MenuModule, TranslateModule],
  exports: [SafeGridRowActionsComponent],
})
export class SafeGridRowActionsModule {}
