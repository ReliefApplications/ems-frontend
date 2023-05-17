import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAlertComponent } from './alert.component';
import { SafeButtonModule } from '../button/button.module';
import { ButtonModule } from '@oort-front/ui';

/** Module for SafeAlertComponent */
@NgModule({
  declarations: [SafeAlertComponent],
  imports: [CommonModule, SafeButtonModule, ButtonModule],
  exports: [SafeAlertComponent],
})
export class SafeAlertModule {}
