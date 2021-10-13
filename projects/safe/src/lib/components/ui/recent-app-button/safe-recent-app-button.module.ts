import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecentAppButtonComponent } from './recent-app-button.component';
import {SafeButtonModule} from '../button/button.module';

@NgModule({
  declarations: [
    RecentAppButtonComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        SafeButtonModule,
    ],
  exports: [
    RecentAppButtonComponent
  ]
})
export class SafeRecentAppButtonModule { }
