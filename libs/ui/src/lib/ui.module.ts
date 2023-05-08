import { NgModule } from '@angular/core';
import { AvatarModule } from './avatar/avatar.module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { FlyoutMenuModule } from './flyout-menu/flyout-menu.module';
import { IconModule } from './icon/icon.module';
import { SelectModule } from './select/select.module';
import { PaginatorModule } from './paginator/paginator.module';
import { AvatarGroupModule } from './avatar-group/avatar-group.module';
import { ToggleModule } from './toggle/toggle.module';
import { DividerModule } from './divider/divider.module';
import { AutocompleteModule } from './autocomplete/autocomplete.module';
import { OptionModule } from './option/option.module';

/**
 * UI Library Module
 */
@NgModule({
  exports: [
    AvatarModule,
    ButtonModule,
    AvatarGroupModule,
    CheckboxModule,
    FlyoutMenuModule,
    IconModule,
    SelectModule,
    PaginatorModule,
    ToggleModule,
    DividerModule,
    AutocompleteModule,
    OptionModule,
  ],
})
export class UiModule {}
