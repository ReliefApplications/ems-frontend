import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MenuModule, TableModule } from '@oort-front/ui';
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
    MatButtonModule,
    MenuModule,
    ReactiveFormsModule,
    MatIconModule,
    SafeButtonModule,
    TranslateModule,
    TableModule,
  ],
  exports: [SafeProfileComponent],
})
export class SafeProfileViewModule {}
