import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationToolbarComponent } from './application-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { WhoConfirmModalModule } from '@who-ems/builder';

@NgModule({
  declarations: [ApplicationToolbarComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    WhoConfirmModalModule
  ],
  exports: [ApplicationToolbarComponent]
})
export class ApplicationToolbarModule { }
