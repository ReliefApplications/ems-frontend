import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUserManagementComponent } from './user-management.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeButtonModule } from '../../components/ui/button/button.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [SafeUserManagementComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    SafeButtonModule,
    MatTabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [SafeUserManagementComponent],
})
export class SafeUserManagementModule {}
