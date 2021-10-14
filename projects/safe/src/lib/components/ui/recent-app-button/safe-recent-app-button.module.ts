import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecentAppButtonComponent } from './recent-app-button.component';
import {SafeButtonModule} from '../button/button.module';
import {SafeAccessModule} from '../../access/access.module';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    RecentAppButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    SafeButtonModule,
    SafeAccessModule,
    MatDividerModule,
    MatMenuModule,
  ],
  exports: [
    RecentAppButtonComponent
  ]
})
export class SafeRecentAppButtonModule { }
