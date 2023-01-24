import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../icon/icon.module';
import { SafeTabSettingsOptionsComponent } from './tab-settings-options.component';

@NgModule({
  declarations: [SafeTabSettingsOptionsComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    SafeIconModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [SafeTabSettingsOptionsComponent],
})
export class SafeTabSettingsOptionsModule {}
