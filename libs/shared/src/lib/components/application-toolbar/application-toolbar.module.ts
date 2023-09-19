import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationToolbarComponent } from './application-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { RouterModule } from '@angular/router';
import { AccessModule } from '../access/access.module';
import { MenuModule, ButtonModule } from '@oort-front/ui';

/**
 * Application toolbar module.
 */
@NgModule({
  declarations: [ApplicationToolbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AccessModule,
    MenuModule,
    IconModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
  ],
  exports: [ApplicationToolbarComponent],
})
export class ApplicationToolbarModule {}
