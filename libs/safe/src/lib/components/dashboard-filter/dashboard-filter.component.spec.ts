import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AppAbility } from '../../services/auth/auth.service';
import { ButtonModule, IconModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeDrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('DashboardFilterComponent', () => {
  let component: DashboardFilterComponent;
  let fixture: ComponentFixture<DashboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [DashboardFilterComponent, SafeDrawerPositionerDirective],
      imports: [
        OAuthModule.forRoot(),
        DialogCdkModule,
        IconModule,
        ButtonModule,
        SafeEmptyModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
        HttpClientModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFilterComponent);
    component = fixture.componentInstance;
    component.containerHeight = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
