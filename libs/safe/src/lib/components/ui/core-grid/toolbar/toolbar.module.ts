import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridToolbarComponent } from './toolbar.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Module declaration for grid toolbar component
 */
@NgModule({
  declarations: [SafeGridToolbarComponent],
  imports: [CommonModule, ButtonModule, TranslateModule],
  exports: [SafeGridToolbarComponent],
})
export class SafeGridToolbarModule {}
