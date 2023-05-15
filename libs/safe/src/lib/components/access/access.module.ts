import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAccessComponent } from './access.component';
import { SafeEditAccessComponent } from './edit-access/edit-access.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MenuModule } from '@oort-front/ui';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../ui/modal/modal.module';
/**
 * SafeAccessModule is a class used to manage all the modules and components related to the access properties.
 */
@NgModule({
  declarations: [SafeAccessComponent, SafeEditAccessComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MenuModule,
    MatTooltipModule,
    SafeButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [SafeAccessComponent],
})
export class SafeAccessModule {}
