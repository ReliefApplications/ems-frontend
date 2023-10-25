import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Login Page module.
 */
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, SpinnerModule],
  exports: [LoginComponent],
})
export class LoginModule {}
