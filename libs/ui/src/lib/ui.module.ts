import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutMenuComponent } from './flyout-menu/flyout-menu.component';
import { AvatarComponent } from './avatar/avatar.component';
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';

/**
 * UI Library Module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [
    FlyoutMenuComponent,
    AvatarComponent,
    SelectComponent,
    CheckboxComponent,
    ButtonComponent,
    IconComponent,
  ],
  exports: [
    FlyoutMenuComponent,
    AvatarComponent,
    SelectComponent,
    CheckboxComponent,
    ButtonComponent,
    IconComponent,
  ],
})
export class UiModule {}
