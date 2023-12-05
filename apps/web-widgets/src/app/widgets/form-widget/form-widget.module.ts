import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';
import { FormModule } from './components/form.module';
import { SidenavContainerModule } from '@oort-front/ui';

/** Form Web widget module. */
@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule, FormModule, SidenavContainerModule],
  exports: [FormWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FormWidgetModule {}
