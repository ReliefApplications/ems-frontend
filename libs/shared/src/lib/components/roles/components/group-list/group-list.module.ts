import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list.component';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  TooltipModule,
} from '@oort-front/ui';
import { ListFilterComponent } from '../../../list-filter/list-filter.component';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * GroupsModule manages modules and components
 * related to the groups tab
 */
@NgModule({
  declarations: [GroupListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    FormWrapperModule,
    ReactiveFormsModule,
    SkeletonTableModule,
    MenuModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ListFilterComponent,
  ],
  exports: [GroupListComponent],
})
export class GroupListModule {}
