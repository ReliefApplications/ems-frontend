import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggersComponent } from './triggers.component';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  TableModule,
  TooltipModule,
  DateModule as UiDateModule,
} from '@oort-front/ui';
import {
  CronExpressionControlModule,
  FilterModule,
  ListFilterComponent,
  ReadableCronModule,
  SkeletonTableModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { TriggersFilterComponent } from './components/triggers-filter/triggers-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TriggersRoutingModule } from './triggers-routing.module';
import { TriggersResourceFiltersComponent } from './components/triggers-resource-filters/triggers-resource-filters.component';
import { ManageTriggerModalComponent } from './components/manage-trigger-modal/manage-trigger-modal.component';
import { TriggersListComponent } from './components/triggers-list/triggers-list.component';

/**
 * Triggers page module.
 */
@NgModule({
  declarations: [
    TriggersComponent,
    TriggersFilterComponent,
    TriggersResourceFiltersComponent,
    ManageTriggerModalComponent,
    TriggersListComponent,
  ],
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
    CronExpressionControlModule,
    ReadableCronModule,
    DialogModule,
  ],
})
export class TriggersModule {}
