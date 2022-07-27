import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGroupsComponent } from './groups.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatInputModule } from '@angular/material/input';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

/**
 * SafeGroupsModule manages modules and components
 * related to the groups tab
 */
@NgModule({
  declarations: [SafeGroupsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    SafeButtonModule,
    MatInputModule,
    SafeSkeletonTableModule,
    MatMenuModule,
    MatTableModule,
  ],
  exports: [SafeGroupsComponent],
})
export class SafeGroupsModule {}
