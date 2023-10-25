import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatedFieldsTabRoutingModule } from './calculated-fields-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DividerModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeEmptyModule } from '@oort-front/safe';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';
import { MenuModule, ButtonModule, TableModule } from '@oort-front/ui';

/**
 * Calculated fields tab of resource page
 */
@NgModule({
  declarations: [CalculatedFieldsTabComponent],
  imports: [
    CommonModule,
    CalculatedFieldsTabRoutingModule,
    IconModule,
    MenuModule,
    TranslateModule,
    OverlayModule,
    SafeEmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
  ],
})
export class CalculatedFieldsTabModule {}
