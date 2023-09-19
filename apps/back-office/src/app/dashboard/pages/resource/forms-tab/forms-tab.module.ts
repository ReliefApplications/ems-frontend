import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsTabRoutingModule } from './forms-tab-routing.module';
import { FormsTabComponent } from './forms-tab.component';
import { DividerModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DateModule, SkeletonTableModule } from '@oort-front/shared';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  ChipModule,
} from '@oort-front/ui';

/**
 * Forms tab of resource page.
 */
@NgModule({
  declarations: [FormsTabComponent],
  imports: [
    CommonModule,
    FormsTabRoutingModule,
    IconModule,
    MenuModule,
    TranslateModule,
    DateModule,
    SkeletonTableModule,
    ButtonModule,
    TableModule,
    ChipModule,
    DividerModule,
  ],
})
export class FormsTabModule {}
