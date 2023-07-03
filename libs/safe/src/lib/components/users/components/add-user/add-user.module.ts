import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAddUserComponent } from './add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  AutocompleteModule,
  SelectMenuModule,
} from '@oort-front/ui';

/** Module for the add user component */
@NgModule({
  declarations: [SafeAddUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
    AutocompleteModule,
    SelectMenuModule,
  ],
  exports: [SafeAddUserComponent],
})
export class SafeAddUserModule {}
