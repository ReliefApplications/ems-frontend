import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridRowActionsComponent } from './row-actions.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    SafeGridRowActionsComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    MatMenuModule
  ],
  exports: [
    SafeGridRowActionsComponent
  ]
})
export class SafeGridRowActionsModule { }
