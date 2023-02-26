import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleUsersComponent } from './role-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { SafeEmptyModule } from '../../ui/empty/empty.module';

/**
 * Users component of role summary
 */
@NgModule({
  declarations: [RoleUsersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
  ],
  exports: [RoleUsersComponent],
})
export class RoleUsersModule {}
