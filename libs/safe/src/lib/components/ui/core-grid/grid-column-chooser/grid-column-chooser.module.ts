import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../button/button.module';
import { SafeGridColumnChooserComponent } from './grid-column-chooser.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SafeGridColumnChooserComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    DropDownsModule,
    MatCheckboxModule,
    FormsModule,
  ],
  exports: [SafeGridColumnChooserComponent],
})
export class SafeGridColumnChooserModule {}
