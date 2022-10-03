import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DerivedFieldsTabRoutingModule } from './derived-fields-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeEditDerivedFieldModalModule,
} from '@safe/builder';
import { DerivedFieldsTabComponent } from './derived-fields-tab.component';
import { MatPaginatorModule } from '@angular/material/paginator';

/**
 * Derived fields tab of resource page
 */
@NgModule({
  declarations: [DerivedFieldsTabComponent],
  imports: [
    CommonModule,
    DerivedFieldsTabRoutingModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeEditDerivedFieldModalModule,
    OverlayModule,
  ],
})
export class DerivedFieldsTabModule {}
