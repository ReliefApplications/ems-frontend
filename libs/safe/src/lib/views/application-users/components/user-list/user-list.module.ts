import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../../components/skeleton/skeleton-table/skeleton-table.module';
import { SafeEmptyModule } from '../../../../components/ui/empty/empty.module';
import { MatIconModule } from '@angular/material/icon';
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
    SafeSkeletonTableModule,
    PaginatorModule,
    SafeEmptyModule,
    MenuModule,
    MatIconModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
  ],
  exports: [UserListComponent],
})
export class UserListModule {}
