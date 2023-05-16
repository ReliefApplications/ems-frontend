import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { SafeEmptyModule } from '../../../../components/ui/empty/empty.module';
import { MenuModule } from '@oort-front/ui';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../../../../components/ui/button/button.module';
import { CheckboxModule } from '@oort-front/ui';

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
    MenuModule,
    MatIconModule,
    SafeButtonModule,
    CheckboxModule,
  ],
  exports: [UserListComponent],
})
export class UserListModule {}
