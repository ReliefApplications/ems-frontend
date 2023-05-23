import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';
import { FormModule } from '../../components/form/form.module';
import { SidenavContainerModule } from '@oort-front/ui';

/** Form Web widget module. */
@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule, FormModule, SidenavContainerModule],
  exports: [FormWidgetComponent],
})
export class FormWidgetModule {}
