import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleUsersComponent } from './role-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { EmptyModule } from '../../ui/empty/empty.module';
import { TableModule, PaginatorModule } from '@oort-front/ui';

/**
 * Users component of role summary
 */
@NgModule({
  declarations: [RoleUsersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    TableModule,
  ],
  exports: [RoleUsersComponent],
})
export class RoleUsersModule {}
