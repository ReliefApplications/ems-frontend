import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

/**
 * Authentication Module. Only handles login.
 */
@NgModule({
  declarations: [],
  imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
