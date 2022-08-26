import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [TabActionsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  exports: [TabActionsComponent],
})
export class TabActionsModule {}
