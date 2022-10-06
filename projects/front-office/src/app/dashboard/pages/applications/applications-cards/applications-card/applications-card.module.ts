import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsCardComponent } from './applications-card.component';
import { SafeIconModule } from '@safe/builder';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [ApplicationsCardComponent],
  imports: [
    CommonModule,
    SafeIconModule,
    MatRippleModule,
  ],
  exports: [ApplicationsCardComponent]
})
export class ApplicationsCardModule { }
