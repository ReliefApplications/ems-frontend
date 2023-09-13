import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../../components/skeleton/skeleton-table/skeleton-table.module';
import { SafeEmptyModule } from '../../../../components/ui/empty/empty.module';
import { IconModule } from '@oort-front/ui';
import {
  MenuModule,
  CheckboxModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Users list module.
 */
@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeSkeletonTableModule,
    PaginatorModule,
    SafeEmptyModule,
    MenuModule,
    IconModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    TooltipModule,
  ],
  exports: [UserListComponent],
})
export class UserListModule {}
