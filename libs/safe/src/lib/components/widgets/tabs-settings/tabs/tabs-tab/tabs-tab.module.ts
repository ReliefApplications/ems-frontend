import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsTabComponent } from './tabs-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, IconModule, TabsModule } from '@oort-front/ui';

@NgModule({
  declarations: [TabsTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    IconModule,
    TabsModule,
  ],
  exports: [TabsTabComponent],
})
export class TabsTabModule {}
