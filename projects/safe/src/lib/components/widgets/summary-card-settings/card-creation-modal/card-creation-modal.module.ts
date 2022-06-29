import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SafeCardCreationModalComponent } from './card-creation-modal.component';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

/** Module for scheduler  component */
@NgModule({
  declarations: [SafeCardCreationModalComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    SafeButtonModule,
    TranslateModule,
    MatRadioModule,
    MatDividerModule,
  ],
  exports: [SafeCardCreationModalComponent],
})
export class SafeCardCreationModalModule {}
