import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationToolbarComponent } from './application-toolbar.component';
import { MatDividerModule } from '@angular/material/divider';
import { SafeConfirmModalModule, SafeButtonModule } from '@safe/builder';

@NgModule({
  declarations: [ApplicationToolbarComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    SafeConfirmModalModule,
    SafeButtonModule
  ],
  exports: [ApplicationToolbarComponent]
})
export class ApplicationToolbarModule { }
