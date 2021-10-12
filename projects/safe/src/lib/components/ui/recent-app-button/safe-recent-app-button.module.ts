import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecentAppButtonComponent } from './recent-app-button.component';

@NgModule({
  declarations: [
    RecentAppButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    RecentAppButtonComponent
  ]
})
export class SafeRecentAppButtonModule { }
