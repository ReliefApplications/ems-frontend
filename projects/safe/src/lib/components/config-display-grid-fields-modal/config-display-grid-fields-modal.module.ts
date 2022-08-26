import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigDisplayGridFieldsModalComponent } from './config-display-grid-fields-modal.component';
import { SafeQueryBuilderModule } from '../query-builder/query-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../ui/button/button.module';

/**
 * ConfigDisplayGridFieldsModalModule is a class used to manage all the modules and components
 * related to the modals of configuration of grid fields.
 */
@NgModule({
  declarations: [ConfigDisplayGridFieldsModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    SafeQueryBuilderModule,
    MatButtonModule,
    MatInputModule,
    TranslateModule,
    SafeButtonModule,
  ],
  exports: [ConfigDisplayGridFieldsModalComponent],
})
export class ConfigDisplayGridFieldsModalModule {}
