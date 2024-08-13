import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  GraphQLSelectModule,
  SelectMenuModule,
  ToggleModule,
} from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, FormWrapperModule, TooltipModule } from '@oort-front/ui';

/**
 * Main tab of form settings modal.
 */
@NgModule({
  declarations: [TabMainComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    IconModule,
    TabsModule,
    TranslateModule,
    GraphQLSelectModule,
    ButtonModule,
    TooltipModule,
    ToggleModule,
    SelectMenuModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
