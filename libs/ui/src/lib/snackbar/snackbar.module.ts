import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './snackbar.component';
import { IconModule } from '../icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Snackbar module
 */
@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule, IconModule, TranslateModule],
})
export class SnackbarModule {}
