import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatedFieldsTabRoutingModule } from './calculated-fields-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule, SafeEmptyModule } from '@oort-front/safe';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';
import { IconModule } from '@oort-front/ui';

/**
 * Calculated fields tab of resource page
 */
@NgModule({
  declarations: [CalculatedFieldsTabComponent],
  imports: [
    CommonModule,
    CalculatedFieldsTabRoutingModule,
    MatTableModule,
    MatMenuModule,
    SafeButtonModule,
    TranslateModule,
    OverlayModule,
    SafeEmptyModule,
    IconModule,
  ],
})
export class CalculatedFieldsTabModule {}
