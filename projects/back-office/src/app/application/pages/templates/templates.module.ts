import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeTemplatesModule } from '@safe/builder';

/**
 * Application templates page module.
 */
@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MatProgressSpinnerModule,
    SafeTemplatesModule,
    // SafeTemplatesModule,
  ],
  exports: [TemplatesComponent],
})
export class TemplatesModule {}
