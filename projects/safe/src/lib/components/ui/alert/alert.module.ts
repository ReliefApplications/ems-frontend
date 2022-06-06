import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAlertComponent } from './alert.component';
import { SafeButtonModule } from '../button/button.module';

/** Module for SafeAlertComponent */
@NgModule({
  declarations: [SafeAlertComponent],
  imports: [CommonModule, SafeButtonModule],
  exports: [SafeAlertComponent],
})
export class SafeAlertModule {}
