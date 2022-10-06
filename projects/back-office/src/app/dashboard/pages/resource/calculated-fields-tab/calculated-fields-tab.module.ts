import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatedFieldsTabRoutingModule } from './calculated-fields-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeEditCalculatedFieldModalModule,
} from '@safe/builder';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';
import { MatPaginatorModule } from '@angular/material/paginator';

/**
 * Calculated fields tab of resource page
 */
@NgModule({
  declarations: [CalculatedFieldsTabComponent],
  imports: [
    CommonModule,
    CalculatedFieldsTabRoutingModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeEditCalculatedFieldModalModule,
    OverlayModule,
  ],
})
export class CalculatedFieldsTabModule {}
