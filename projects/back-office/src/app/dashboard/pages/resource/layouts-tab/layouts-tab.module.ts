import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsTabRoutingModule } from './layouts-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeLayoutModalModule,
  SafeDateModule,
  SafeSkeletonTableModule,
} from '@safe/builder';
import { LayoutsTabComponent } from './layouts-tab.component';

@NgModule({
  declarations: [LayoutsTabComponent],
  imports: [
    CommonModule,
    LayoutsTabRoutingModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeLayoutModalModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
  ],
})
export class LayoutsTabModule {}
