import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationHeaderComponent } from './application-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { RouterModule } from '@angular/router';
import { MenuModule, ButtonModule } from '@oort-front/ui';

/**
 * Application toolbar module.
 */
@NgModule({
  declarations: [ApplicationHeaderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    IconModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
  ],
  exports: [ApplicationHeaderComponent],
})
export class ApplicationHeaderModule {}
