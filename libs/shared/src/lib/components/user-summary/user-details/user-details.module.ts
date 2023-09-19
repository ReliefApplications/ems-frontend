import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { ButtonModule, FormWrapperModule } from '@oort-front/ui';

/**
 * User details module.
 */
@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    AbilityModule,
    ButtonModule,
  ],
  exports: [UserDetailsComponent],
})
export class UserDetailsModule {}
