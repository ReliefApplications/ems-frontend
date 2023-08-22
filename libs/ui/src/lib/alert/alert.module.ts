import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';

/** UI Alert module */
@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, ButtonModule, IconModule],
  exports: [AlertComponent],
})
export class AlertModule {}
