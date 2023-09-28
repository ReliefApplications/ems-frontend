import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsTabRoutingModule } from './layouts-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { LayoutsTabComponent } from './layouts-tab.component';
import { PaginatorModule } from '@oort-front/ui';
import { DataPresentationListComponent } from '../components/data-presentation-list/data-presentation-list.component';

/**
 * Layouts tab of resource page
 */
@NgModule({
  declarations: [LayoutsTabComponent],
  imports: [
    CommonModule,
    LayoutsTabRoutingModule,
    OverlayModule,
    PaginatorModule,
    DataPresentationListComponent,
  ],
})
export class LayoutsTabModule {}
