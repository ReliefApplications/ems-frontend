import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationTemplatesRoutingModule } from './application-templates-routing.module';
import { SafeApplicationTemplatesComponent } from './application-templates.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SafeTemplatesModule } from '../../components/templates/templates.module';

/**
 * Application templates page module.
 */
@NgModule({
  declarations: [SafeApplicationTemplatesComponent],
  imports: [
    CommonModule,
    SafeApplicationTemplatesRoutingModule,
    MatProgressSpinnerModule,
    SafeTemplatesModule,
  ],
  exports: [SafeApplicationTemplatesComponent],
})
export class SafeApplicationTemplatesViewModule {}
