import { NgModule } from '@angular/core';
import { AvatarModule } from './avatar/avatar.module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { IconModule } from './icon/icon.module';
import { SelectModule } from './select/select.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { SpinnerModule } from './spinner/spinner.module';
import { PaginatorModule } from './paginator/paginator.module';
import { AvatarGroupModule } from './avatar-group/avatar-group.module';
import { ToggleModule } from './toggle/toggle.module';
import { DividerModule } from './divider/divider.module';
import { TextareaModule } from './textarea/textarea.module';
import { RadioModule } from './radio/radio.module';
import { NavigationTabsModule } from './navigation-tabs/navigation-tabs.module';
import { TabModule } from './tab/tab.module';

/**
 * UI Library Module
 */
@NgModule({
  exports: [
    AvatarModule,
    ButtonModule,
    AvatarGroupModule,
    CheckboxModule,
    IconModule,
    SelectModule,
    TooltipModule,
    SpinnerModule,
    PaginatorModule,
    ToggleModule,
    DividerModule,
    TextareaModule,
    RadioModule,
    NavigationTabsModule,
    TabModule,
  ],
})
export class UiModule {}
