import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsCardComponent } from './applications-card.component';
import { SafeIconModule } from '@safe/builder';
import { MatRippleModule } from '@angular/material/core';

/**
 * Card module used to create
 * a card with some informations
 */
@NgModule({
  declarations: [ApplicationsCardComponent],
  imports: [CommonModule, SafeIconModule, MatRippleModule],
  exports: [ApplicationsCardComponent],
})
export class ApplicationsCardModule {}
