import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGroupListComponent } from './group-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
} from '@oort-front/ui';

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
    FormWrapperModule,
    SafeSkeletonTableModule,
    MenuModule,
    TableModule,
    ButtonModule,
  ],
  exports: [SafeGroupListComponent],
})
export class SafeGroupListModule {}
