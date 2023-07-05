import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralTabComponent } from './general-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule } from '@oort-front/ui';

@NgModule({
  declarations: [GeneralTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
  ],
  exports: [GeneralTabComponent],
})
export class GeneralTabModule {}
