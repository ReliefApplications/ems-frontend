import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsParametersComponent } from './layouts-parameters.component';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AddLayoutModule } from '../add-layout/add-layout.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLayoutModalModule } from '../../../layout-modal/layout-modal.module';
import { SafeDateModule } from '../../../../pipes/date/date.module';

@NgModule({
  declarations: [LayoutsParametersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    DragDropModule,
    SafeButtonModule,
    AddLayoutModule,
    SafeLayoutModalModule,
    SafeDateModule,
  ],
  exports: [LayoutsParametersComponent],
})
export class LayoutsParametersModule {}
