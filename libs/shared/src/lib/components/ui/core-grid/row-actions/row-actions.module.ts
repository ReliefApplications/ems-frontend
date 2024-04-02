import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridRowActionsComponent } from './row-actions.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MenuModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the grid row actions component */
@NgModule({
  declarations: [GridRowActionsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    TooltipModule,
  ],
  exports: [GridRowActionsComponent],
})
export class GridRowActionsModule {}
