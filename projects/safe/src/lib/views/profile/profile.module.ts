import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { SafeButtonModule } from '../../components/ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeProfileRoutingModule } from './profile-routing.module';

/**
 * Shared profile page module.
 */
@NgModule({
  declarations: [SafeProfileComponent],
  imports: [
    CommonModule,
    SafeProfileRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatIconModule,
    SafeButtonModule,
    TranslateModule,
  ],
  exports: [SafeProfileComponent],
})
export class SafeProfileViewModule {}
