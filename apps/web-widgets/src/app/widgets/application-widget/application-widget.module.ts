import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationWidgetComponent } from './application-widget.component';
import { ApplicationModule } from '../../components/application/application.module';
import { MatSidenavModule } from '@angular/material/sidenav';

/** Application web widget module */
@NgModule({
  declarations: [ApplicationWidgetComponent],
  imports: [CommonModule, ApplicationModule, MatSidenavModule],
  exports: [ApplicationWidgetComponent],
})
export class ApplicationWidgetModule {}
