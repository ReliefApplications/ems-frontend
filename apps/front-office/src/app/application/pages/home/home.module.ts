import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Home page module.
 */
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, SpinnerModule],
})
export class HomeModule {}
