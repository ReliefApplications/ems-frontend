import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsTabRoutingModule } from './layouts-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DividerModule, IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  DateModule,
  SkeletonTableModule,
  EmptyModule,
} from '@oort-front/shared';
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
    IconModule,
    MenuModule,
    TranslateModule,
    OverlayModule,
    DateModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
    TooltipModule,
  ],
})
export class LayoutsTabModule {}
