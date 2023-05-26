import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAccessComponent } from './access.component';
import { SafeEditAccessComponent } from './edit-access/edit-access.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import { TooltipModule, MenuModule, ButtonModule } from '@oort-front/ui';

/**
 * SafeAccessModule is a class used to manage all the modules and components related to the access properties.
 */
@NgModule({
  declarations: [SafeAccessComponent, SafeEditAccessComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TooltipModule,
    MenuModule,
    TranslateModule,
    ButtonModule,
  ],
  exports: [SafeAccessComponent],
})
export class SafeAccessModule {}
