import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { FilterComponent } from './filter/filter.component';
import {
  ButtonModule,
  CheckboxModule,
  IconModule,
  MenuModule,
  PaginatorModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '@oort-front/shared';

/** Users page module */
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FilterComponent,
    ButtonModule,
    TranslateModule,
    MenuModule,
    TableModule,
    CheckboxModule,
    IconModule,
    SkeletonTableModule,
    TooltipModule,
    PaginatorModule,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
