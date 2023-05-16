import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatedFieldsTabRoutingModule } from './calculated-fields-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule } from '@oort-front/ui';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule, SafeEmptyModule } from '@oort-front/safe';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';

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
    MenuModule,
    SafeButtonModule,
    TranslateModule,
    OverlayModule,
    SafeEmptyModule,
  ],
})
export class CalculatedFieldsTabModule {}
