import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessComponent } from './access.component';
import { EditAccessComponent } from './edit-access/edit-access.component';
import { IconModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  TooltipModule,
  MenuModule,
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  DialogModule,
} from '@oort-front/ui';
import { AbilityModule } from '@casl/angular';

/**
 * AccessModule is a class used to manage all the modules and components related to the access properties.
 */
@NgModule({
  declarations: [AccessComponent, EditAccessComponent],
  imports: [
    CommonModule,
    IconModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    MenuModule,
    TranslateModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    AbilityModule,
  ],
  exports: [AccessComponent, EditAccessComponent],
})
export class AccessModule {}
