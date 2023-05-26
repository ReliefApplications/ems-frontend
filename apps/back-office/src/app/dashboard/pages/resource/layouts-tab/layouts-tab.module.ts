import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsTabRoutingModule } from './layouts-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeDateModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { LayoutsTabComponent } from './layouts-tab.component';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/**
 * Layouts tab of resource page
 */
@NgModule({
  declarations: [LayoutsTabComponent],
  imports: [
    CommonModule,
    LayoutsTabRoutingModule,
    MatIconModule,
    MenuModule,
    TranslateModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    PaginatorModule,
    SafeEmptyModule,
    ButtonModule,
    TableModule,
  ],
})
export class LayoutsTabModule {}
