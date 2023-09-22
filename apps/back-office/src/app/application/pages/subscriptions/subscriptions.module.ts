import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { SkeletonTableModule, EmptyModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule, GraphQLSelectModule } from '@oort-front/ui';
import {
  MenuModule,
  ButtonModule,
  DividerModule,
  SpinnerModule,
  TableModule,
} from '@oort-front/ui';

/**
 * Application subscriptions page module.
 */
@NgModule({
  declarations: [SubscriptionsComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    FormsModule,
    SkeletonTableModule,
    EmptyModule,
    ReactiveFormsModule,
    IconModule,
    SpinnerModule,
    MenuModule,
    DividerModule,
    TranslateModule,
    GraphQLSelectModule,
    DialogModule,
    ButtonModule,
    TableModule,
    TooltipModule,
  ],
})
export class SubscriptionsModule {}
