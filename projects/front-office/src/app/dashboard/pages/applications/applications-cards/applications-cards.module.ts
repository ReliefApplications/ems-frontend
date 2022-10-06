import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsCardsComponent } from './applications-cards.component';
import { ApplicationsCardModule } from './applications-card/applications-card.module';
import { SafeSkeletonModule } from '@safe/builder';




@NgModule({
  declarations: [ApplicationsCardsComponent],
  imports: [
    CommonModule,
    ApplicationsCardModule,
    SafeSkeletonModule,
  ],
  exports: [ApplicationsCardsComponent]
})
export class ApplicationsCardsModule { }
