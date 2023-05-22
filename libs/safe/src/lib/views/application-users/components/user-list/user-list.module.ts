import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { SafeEmptyModule } from '../../../../components/ui/empty/empty.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SafeButtonModule } from '../../../../components/ui/button/button.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { IconModule } from '@oort-front/ui';

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
    SafeButtonModule,
    MatCheckboxModule,
    IconModule,
  ],
  exports: [UserListComponent],
})
export class UserListModule {}
