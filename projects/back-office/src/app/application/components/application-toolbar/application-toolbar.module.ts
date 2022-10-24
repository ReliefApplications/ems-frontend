import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationToolbarComponent } from './application-toolbar.component';
import { SafeButtonModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Application toolbar module.
 */
@NgModule({
  declarations: [ApplicationToolbarComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    TranslateModule,
  ],
  exports: [ApplicationToolbarComponent],
})
export class ApplicationToolbarModule {}
