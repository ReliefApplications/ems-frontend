import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridToolbarComponent } from './toolbar.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Module declaration for grid toolbar component
 */
@NgModule({
  declarations: [GridToolbarComponent],
  imports: [CommonModule, ButtonModule, TranslateModule],
  exports: [GridToolbarComponent],
})
export class GridToolbarModule {}
