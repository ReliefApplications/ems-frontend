import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SafeEmptyModule } from '../../../../components/ui/empty/empty.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../../../../components/ui/button/button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Users list module.
 */
@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
    MatMenuModule,
    MatIconModule,
    SafeButtonModule,
    MatCheckboxModule,
  ],
  exports: [UserListComponent],
})
export class UserListModule {}
