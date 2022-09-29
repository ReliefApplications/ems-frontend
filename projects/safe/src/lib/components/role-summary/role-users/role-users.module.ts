import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleUsersComponent } from './role-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';

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
  ],
  exports: [RoleUsersComponent],
})
export class RoleUsersModule {}
