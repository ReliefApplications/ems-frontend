import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ChipModule,
  DividerModule,
  IconModule,
  MenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { EmptyModule } from '@oort-front/shared';
import { ValidationTabRoutingModule } from './validation-tab-routing.module';
import { ValidationTabComponent } from './validation-tab.component';

/**
 * Validation tab of resource page
 */
@NgModule({
  declarations: [ValidationTabComponent],
  imports: [
    CommonModule,
    ValidationTabRoutingModule,
    IconModule,
    MenuModule,
    TranslateModule,
    OverlayModule,
    EmptyModule,
    ButtonModule,
    TableModule,
    ChipModule,
    DividerModule,
    TooltipModule,
  ],
})
export class ValidationTabModule {}
