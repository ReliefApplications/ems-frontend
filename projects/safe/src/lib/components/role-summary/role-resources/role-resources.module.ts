import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [RoleResourcesComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
    SafeDateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
