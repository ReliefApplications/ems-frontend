import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppResizableBoxComponent } from './app-resizable-box.component';

/**
 * UI App Resizable box module
 */
@NgModule({
  declarations: [AppResizableBoxComponent],
  imports: [CommonModule],
  exports: [AppResizableBoxComponent],
})
export class AppResizableBoxModule {}
