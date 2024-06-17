import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridRowActionsComponent } from './row-actions.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MenuModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '@progress/kendo-angular-icons';

/** Module for the grid row actions component */
@NgModule({
  declarations: [GridRowActionsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    IconsModule,
  ],
  exports: [GridRowActionsComponent],
})
export class GridRowActionsModule {}
