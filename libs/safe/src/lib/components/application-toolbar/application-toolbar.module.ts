import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationToolbarComponent } from './application-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { RouterModule } from '@angular/router';
import { SafeAccessModule } from '../access/access.module';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';

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
    MatMenuModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    SafeIconModule,
  ],
  exports: [SafeApplicationToolbarComponent],
})
export class SafeApplicationToolbarModule {}
