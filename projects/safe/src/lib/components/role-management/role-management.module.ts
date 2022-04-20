import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRoleManagementComponent } from './role-management.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeButtonModule } from '../../components/ui/button/button.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [SafeRoleManagementComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    SafeButtonModule,
    MatTabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  exports: [SafeRoleManagementComponent],
})
export class SafeRoleManagementModule {}
