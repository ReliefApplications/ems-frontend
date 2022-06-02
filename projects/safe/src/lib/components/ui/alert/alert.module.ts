import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAlertComponent } from './alert.component';
import { SafeIconModule } from '../icon/icon.module';

/** Module for SafeAlertComponent */
@NgModule({
  declarations: [SafeAlertComponent],
  imports: [CommonModule, SafeIconModule],
  exports: [SafeAlertComponent],
})
export class SafeAlertModule {}
