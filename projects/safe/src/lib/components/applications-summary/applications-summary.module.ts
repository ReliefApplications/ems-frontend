import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeAddApplicationComponent } from './components/add-application/add-application.component';
import { SafeApplicationSummaryComponent } from './components/application-summary/application-summary.component';
import { MatRippleModule } from '@angular/material/core';
import { SafeIconModule } from '../ui/icon/icon.module';

@NgModule({
  declarations: [
    SafeApplicationsSummaryComponent,
    SafeAddApplicationComponent,
    SafeApplicationSummaryComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    SafeIconModule
  ],
  exports: [
    SafeApplicationsSummaryComponent,
    SafeAddApplicationComponent,
    SafeApplicationSummaryComponent
  ]
})
export class SafeApplicationsSummaryModule { }
