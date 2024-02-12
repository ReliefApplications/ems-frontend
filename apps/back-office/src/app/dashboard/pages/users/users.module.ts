import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
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
import { SkeletonTableModule, UsersFilterComponent } from '@oort-front/shared';

/** Users page module */
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ButtonModule,
    TranslateModule,
    MenuModule,
    TableModule,
    CheckboxModule,
    IconModule,
    SkeletonTableModule,
    TooltipModule,
    PaginatorModule,
    UsersFilterComponent,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
