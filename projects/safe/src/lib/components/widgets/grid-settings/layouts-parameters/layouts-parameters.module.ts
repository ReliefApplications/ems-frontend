import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsParametersComponent } from './layouts-parameters.component';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LayoutsParametersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    SafeButtonModule,
  ],
  exports: [LayoutsParametersComponent],
})
export class LayoutsParametersModule {}
