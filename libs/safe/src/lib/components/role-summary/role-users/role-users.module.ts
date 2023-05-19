import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleUsersComponent } from './role-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { SafeEmptyModule } from '../../ui/empty/empty.module';
import { TableModule } from '@oort-front/ui';

/**
 * Users component of role summary
 */
@NgModule({
  declarations: [RoleUsersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
    TableModule,
  ],
  exports: [RoleUsersComponent],
})
export class RoleUsersModule {}
