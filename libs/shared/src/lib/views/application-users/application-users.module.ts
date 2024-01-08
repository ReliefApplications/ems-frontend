import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationUsersComponent } from './application-users.component';
import { ApplicationUsersRoutingModule } from './application-users-routing.module';
import { UserListModule } from './components/user-list/user-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule, ButtonModule, MenuModule } from '@oort-front/ui';

/**
 * Application users view module.
 */
@NgModule({
  declarations: [ApplicationUsersComponent],
  imports: [
    CommonModule,
    ApplicationUsersRoutingModule,
    UserListModule,
    TranslateModule,
    TabsModule,
    MenuModule,
    ButtonModule,
  ],
  exports: [ApplicationUsersComponent],
})
export class ApplicationUsersViewModule {}
