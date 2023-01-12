import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';

/** Module for users table component */
@NgModule({
  declarations: [UsersTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatCheckboxModule,
    MatMenuModule,
    SafeSkeletonTableModule,
    MatIconModule,
    SafeButtonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  exports: [UsersTableComponent],
})
export class SafeUsersTableModule {}
