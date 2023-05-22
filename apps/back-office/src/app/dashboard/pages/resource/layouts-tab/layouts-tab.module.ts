import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsTabRoutingModule } from './layouts-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeDateModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { LayoutsTabComponent } from './layouts-tab.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { IconModule } from '@oort-front/ui';

/**
 * Layouts tab of resource page
 */
@NgModule({
  declarations: [LayoutsTabComponent],
  imports: [
    CommonModule,
    LayoutsTabRoutingModule,
    MatTableModule,
    MatMenuModule,
    SafeButtonModule,
    TranslateModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
    IconModule,
  ],
})
export class LayoutsTabModule {}
