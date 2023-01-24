import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { ConfigDisplayGridFieldsModalComponent } from './config-display-grid-fields-modal.component';
import { SafeQueryBuilderModule } from '../query-builder/query-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * ConfigDisplayGridFieldsModalModule is a class used to manage all the modules and components
 * related to the modals of configuration of grid fields.
 */
@NgModule({
  declarations: [ConfigDisplayGridFieldsModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    SafeQueryBuilderModule,
    MatButtonModule,
    MatInputModule,
    TranslateModule,
    SafeButtonModule,
    SafeModalModule,
  ],
  exports: [ConfigDisplayGridFieldsModalComponent],
})
export class ConfigDisplayGridFieldsModalModule {}
