import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationTemplatesRoutingModule } from './application-templates-routing.module';
import { ApplicationTemplatesComponent } from './application-templates.component';
import { SpinnerModule } from '@oort-front/ui';
import { TemplatesModule } from '../../components/templates/templates.module';

/**
 * Application templates page module.
 */
@NgModule({
  declarations: [ApplicationTemplatesComponent],
  imports: [
    CommonModule,
    ApplicationTemplatesRoutingModule,
    SpinnerModule,
    TemplatesModule,
  ],
  exports: [ApplicationTemplatesComponent],
})
export class ApplicationTemplatesViewModule {}
