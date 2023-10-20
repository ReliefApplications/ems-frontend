import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Spinner module
 */
@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, TranslateModule],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
