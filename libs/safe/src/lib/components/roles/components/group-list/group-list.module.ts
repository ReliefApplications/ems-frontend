import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGroupListComponent } from './group-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import { MenuModule, TableModule } from '@oort-front/ui';

/**
 * SafeGroupsModule manages modules and components
 * related to the groups tab
 */
@NgModule({
  declarations: [SafeGroupListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatFormFieldModule,
    SafeButtonModule,
    MatInputModule,
    SafeSkeletonTableModule,
    MenuModule,
    TableModule,
  ],
  exports: [SafeGroupListComponent],
})
export class SafeGroupListModule {}
