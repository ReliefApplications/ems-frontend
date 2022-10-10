import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationToolbarComponent } from './application-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SafeAccessModule } from '../access/access.module';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeConfirmModalModule } from '../confirm-modal/confirm-modal.module';

/**
 * Application toolbar module.
 */
@NgModule({
  declarations: [SafeApplicationToolbarComponent],
  imports: [
    CommonModule,
    SafeConfirmModalModule,
    SafeButtonModule,
    TranslateModule,
    SafeAccessModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
  exports: [SafeApplicationToolbarComponent],
})
export class SafeApplicationToolbarModule {}
