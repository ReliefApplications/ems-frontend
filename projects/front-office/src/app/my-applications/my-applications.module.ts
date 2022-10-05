import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyApplicationsComponent } from './my-applications.component';
import { MyApplicationsRoutingModule } from './my-applications-routing.module';
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
    MyApplicationsComponent,
    CardComponent,
    CardsComponent,
  ],
  imports: [
    CommonModule,
    MyApplicationsRoutingModule,
    SafeLayoutModule,
    SafeApplicationsSummaryModule,
    SafeSkeletonModule,
    SafeIconModule,
    SafeToolbarModule,
    MatRippleModule,
  ]
})
export class MyApplicationsModule { }
