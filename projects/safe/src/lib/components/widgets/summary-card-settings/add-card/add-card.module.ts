import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardComponent } from './add-card.component';

/** Module to add new card in summary card widget */
@NgModule({
  declarations: [SafeAddCardComponent],
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
  exports: [SafeAddCardComponent],
})
export class SafeAddCardModule {}
