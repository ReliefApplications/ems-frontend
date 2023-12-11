import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { TranslateModule } from '@ngx-translate/core';

/** UI Alert module */
@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    TooltipModule,
    TranslateModule,
  ],
  exports: [AlertComponent],
})
export class AlertModule {}
