import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutMenuComponent } from './flyout-menu.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Flyout Menu Module
 */
@NgModule({
  declarations: [FlyoutMenuComponent],
  imports: [CommonModule, TranslateModule],
  exports: [FlyoutMenuComponent],
})
export class FlyoutMenuModule {}
