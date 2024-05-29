import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';

/** Module for the add user component */
@NgModule({
  declarations: [AddUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
  ],
  exports: [AddUserComponent],
})
export class AddUserModule {}
