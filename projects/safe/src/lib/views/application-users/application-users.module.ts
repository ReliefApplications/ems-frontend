import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationUsersComponent } from './application-users.component';
import { SafeApplicationUsersRoutingModule } from './application-users-routing.module';
import { UserListModule } from './components/user-list/user-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../components/ui/button/button.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { SafeInviteUsersModule } from '../../components/users/components/invite-users/invite-users.module';

@NgModule({
  declarations: [SafeApplicationUsersComponent],
  imports: [
    CommonModule,
    SafeApplicationUsersRoutingModule,
    UserListModule,
    TranslateModule,
    SafeButtonModule,
    MatTabsModule,
    MatMenuModule,
    SafeInviteUsersModule,
  ],
  exports: [SafeApplicationUsersComponent],
})
export class SafeApplicationUsersViewModule {}
