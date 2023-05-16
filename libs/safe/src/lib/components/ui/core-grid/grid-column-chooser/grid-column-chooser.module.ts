import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../button/button.module';
import { SafeGridColumnChooserComponent } from './grid-column-chooser.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeGridColumnChooserComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    DropDownsModule,
    MatCheckboxModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [SafeGridColumnChooserComponent],
})
export class SafeGridColumnChooserModule {}
