import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationTemplatesRoutingModule } from './application-templates-routing.module';
import { SafeApplicationTemplatesComponent } from './application-templates.component';
import { SpinnerModule } from '@oort-front/ui';
import { SafeTemplatesModule } from '../../components/templates/templates.module';

/**
 * Application templates page module.
 */
@NgModule({
  declarations: [SafeApplicationTemplatesComponent],
  imports: [
    CommonModule,
    SafeApplicationTemplatesRoutingModule,
    SpinnerModule,
    SafeTemplatesModule,
  ],
  exports: [SafeApplicationTemplatesComponent],
})
export class SafeApplicationTemplatesViewModule {}
