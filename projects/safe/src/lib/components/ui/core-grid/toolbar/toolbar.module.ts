import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridToolbarComponent } from './toolbar.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';

/** Module for the grid toolbar component */
@NgModule({
  declarations: [SafeGridToolbarComponent],
  imports: [CommonModule, ButtonModule],
  exports: [SafeGridToolbarComponent],
})
export class SafeGridToolbarModule {}
