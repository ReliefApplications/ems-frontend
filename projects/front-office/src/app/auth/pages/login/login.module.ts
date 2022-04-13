import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { SafeButtonModule } from '@safe/builder';

/**
 * Login Page Module.
 */
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    LoginRoutingModule,
    MatGridListModule,
    SafeButtonModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
