import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationToolbarComponent } from './application-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { RouterModule } from '@angular/router';
import { SafeAccessModule } from '../access/access.module';
import { MenuModule, ButtonModule } from '@oort-front/ui';

/**
 * Application toolbar module.
 */
@NgModule({
  declarations: [SafeApplicationToolbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeAccessModule,
    MenuModule,
    IconModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
  ],
  exports: [SafeApplicationToolbarComponent],
})
export class SafeApplicationToolbarModule {}
