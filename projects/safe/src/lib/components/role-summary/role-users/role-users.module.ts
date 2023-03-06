import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleUsersComponent } from './role-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';
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
