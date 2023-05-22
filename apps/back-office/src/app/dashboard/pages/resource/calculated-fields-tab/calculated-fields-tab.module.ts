import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatedFieldsTabRoutingModule } from './calculated-fields-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeEmptyModule } from '@oort-front/safe';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';
import { MenuModule, ButtonModule } from '@oort-front/ui';

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
    TranslateModule,
    OverlayModule,
    SafeEmptyModule,
    ButtonModule,
  ],
})
export class CalculatedFieldsTabModule {}
