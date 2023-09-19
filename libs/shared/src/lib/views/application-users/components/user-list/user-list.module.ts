import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../../../../components/skeleton/skeleton-table/skeleton-table.module';
import { EmptyModule } from '../../../../components/ui/empty/empty.module';
import { IconModule } from '@oort-front/ui';
import {
  MenuModule,
  CheckboxModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/**
 * Users list module.
 */
@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    MenuModule,
    IconModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
  ],
  exports: [UserListComponent],
})
export class UserListModule {}
