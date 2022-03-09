import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationWidgetComponent } from './application-widget.component';
import { ApplicationModule } from '../../components/application/application.module';

@NgModule({
  declarations: [ApplicationWidgetComponent],
  imports: [CommonModule, ApplicationModule],
  exports: [ApplicationWidgetComponent],
})
export class ApplicationWidgetModule {}
