import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationUsersComponent } from './application-users.component';
import { SafeApplicationUsersRoutingModule } from './application-users-routing.module';
import { UserListModule } from './components/user-list/user-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MenuModule, ButtonModule } from '@oort-front/ui';
import { SafeInviteUsersModule } from '../../components/users/components/invite-users/invite-users.module';

/**
 * Application users view module.
 */
@NgModule({
  declarations: [SafeApplicationUsersComponent],
  imports: [
    CommonModule,
    SafeApplicationUsersRoutingModule,
    UserListModule,
    TranslateModule,
    MatTabsModule,
    MenuModule,
    SafeInviteUsersModule,
    ButtonModule,
  ],
  exports: [SafeApplicationUsersComponent],
})
export class SafeApplicationUsersViewModule {}
