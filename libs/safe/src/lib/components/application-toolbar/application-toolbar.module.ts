import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationToolbarComponent } from './application-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule, IconModule } from '@oort-front/ui';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { RouterModule } from '@angular/router';
import { SafeAccessModule } from '../access/access.module';
import { SafeButtonModule } from '../ui/button/button.module';

/**
 * Application toolbar module.
 */
@NgModule({
  declarations: [SafeApplicationToolbarComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    TranslateModule,
    SafeAccessModule,
    MenuModule,
    IconModule,
    MatListModule,
    RouterModule,
  ],
  exports: [SafeApplicationToolbarComponent],
})
export class SafeApplicationToolbarModule {}
