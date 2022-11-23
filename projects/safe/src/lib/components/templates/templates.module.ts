import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { EditTemplateModalModule } from './components/edit-template-modal/edit-template-modal.module';
import { SafeDividerModule } from '../ui/divider/divider.module';

/** Module for components related to templates */
@NgModule({
  declarations: [SafeTemplatesComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatIconModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    EditTemplateModalModule,
    SafeDividerModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
