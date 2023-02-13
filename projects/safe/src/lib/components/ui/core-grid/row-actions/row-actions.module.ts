import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridRowActionsComponent } from './row-actions.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the grid row actions component */
@NgModule({
  declarations: [SafeGridRowActionsComponent],
  imports: [CommonModule, ButtonModule, MatMenuModule, TranslateModule],
  exports: [SafeGridRowActionsComponent],
})
export class SafeGridRowActionsModule {}
