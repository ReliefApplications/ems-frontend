import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SafeButtonModule,
  ],
  exports: [UserDetailsComponent],
})
export class UserDetailsModule {}
