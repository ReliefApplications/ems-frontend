import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationWidgetComponent } from './application-widget.component';
import { ApplicationModule } from '../../components/application/application.module';
import { SidenavContainerModule } from '@oort-front/ui';

/** Application web widget module */
@NgModule({
  declarations: [ApplicationWidgetComponent],
  imports: [CommonModule, ApplicationModule, SidenavContainerModule],
  exports: [ApplicationWidgetComponent],
})
export class ApplicationWidgetModule {}
