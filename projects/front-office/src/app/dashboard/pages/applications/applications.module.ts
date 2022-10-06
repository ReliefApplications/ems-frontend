import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsCardsModule } from './applications-cards/applications-cards.module';

/**
 * Applications page module.
 */
@NgModule({
  declarations: [ApplicationsComponent],
  imports: [CommonModule, ApplicationsCardsModule, ApplicationsRoutingModule],
})
export class ApplicationsModule {}
