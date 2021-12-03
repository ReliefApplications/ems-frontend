import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBadgeComponent } from './badge.component';
import { MatChipsModule } from '@angular/material/chips';



@NgModule({
  declarations: [
    SafeBadgeComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule
  ],
  exports: [
    SafeBadgeComponent
  ]
})
export class SafeBadgeModule { }
