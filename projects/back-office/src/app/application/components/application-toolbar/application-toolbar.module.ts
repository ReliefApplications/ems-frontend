import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationToolbarComponent } from './application-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [ApplicationToolbarComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule
  ],
  exports: [ApplicationToolbarComponent]
})
export class ApplicationToolbarModule { }
