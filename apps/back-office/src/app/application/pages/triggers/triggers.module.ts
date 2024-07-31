import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggersComponent } from './triggers.component';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  TableModule,
  TooltipModule,
  DateModule as UiDateModule,
} from '@oort-front/ui';
import {
  FilterModule,
  ListFilterComponent,
  SkeletonTableModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { TriggersFilterComponent } from './components/triggers-filter/triggers-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TriggersRoutingModule } from './triggers-routing.module';

/**
 * Triggers page module.
 */
@NgModule({
  declarations: [TriggersComponent, TriggersFilterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    PaginatorModule,
    IconModule,
    FormWrapperModule,
    ReactiveFormsModule,
    ListFilterComponent,
    UiDateModule,
    TableModule,
    SkeletonTableModule,
    TriggersRoutingModule,
    TooltipModule,
    FilterModule,
  ],
})
export class TriggersModule {}
