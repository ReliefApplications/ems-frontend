import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsTabRoutingModule } from './forms-tab-routing.module';
import { FormsTabComponent } from './forms-tab.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeDateModule,
  SafeConfirmModalModule,
  SafeSkeletonTableModule,
} from '@safe/builder';

@NgModule({
  declarations: [FormsTabComponent],
  imports: [
    CommonModule,
    FormsTabRoutingModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeDateModule,
    SafeConfirmModalModule,
    SafeSkeletonTableModule,
  ],
})
export class FormsTabModule {}
