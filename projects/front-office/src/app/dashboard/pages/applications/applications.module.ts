import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import {
  SafeLayoutModule,
  SafeApplicationsSummaryModule,
  SafeSkeletonModule,
  SafeIconModule,
  SafeToolbarModule,
} from '@safe/builder';
import { MatRippleModule } from '@angular/material/core';
import { CardComponent } from './card/card.component';
import { CardsComponent } from './cards/cards.component';

@NgModule({
  declarations: [
    ApplicationsComponent,
    CardComponent,
    CardsComponent,
  ],
  imports: [
    CommonModule,
    ApplicationsRoutingModule,
    SafeLayoutModule,
    SafeApplicationsSummaryModule,
    SafeSkeletonModule,
    SafeIconModule,
    SafeToolbarModule,
    MatRippleModule,
  ]
})
export class ApplicationsModule { }
