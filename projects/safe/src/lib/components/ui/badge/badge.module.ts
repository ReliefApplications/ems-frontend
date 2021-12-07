import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBadgeComponent } from './badge.component';
import { MatChipsModule } from '@angular/material/chips';
import { SafeIconModule } from '../icon/icon.module';

@NgModule({
  declarations: [
    SafeBadgeComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    SafeIconModule
  ],
  exports: [
    SafeBadgeComponent
  ]
})
export class SafeBadgeModule { }
