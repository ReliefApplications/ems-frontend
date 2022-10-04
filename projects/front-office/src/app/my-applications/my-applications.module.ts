import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyApplicationsComponent } from './my-applications.component';
import { MyApplicationsRoutingModule } from './my-applications-routing.module';
import {
  SafeLayoutModule,
  SafeApplicationsSummaryModule,
  SafeSkeletonModule,
  SafeIconModule
} from '@safe/builder';
import { MatRippleModule } from '@angular/material/core';
import { CardComponent } from './card/card.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    MyApplicationsComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    MyApplicationsRoutingModule,
    SafeLayoutModule,
    SafeApplicationsSummaryModule,
    SafeSkeletonModule,
    SafeIconModule,
    MatRippleModule,
    MatTabsModule
  ]
})
export class MyApplicationsModule { }
