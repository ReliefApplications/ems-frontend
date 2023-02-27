import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';
import { FormModule } from '../../components/form/form.module';
import { MatSidenavModule } from '@angular/material/sidenav';

/** Form Web widget module. */
@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule, FormModule, MatSidenavModule],
  exports: [FormWidgetComponent],
})
export class FormWidgetModule {}
