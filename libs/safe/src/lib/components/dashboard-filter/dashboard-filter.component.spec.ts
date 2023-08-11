import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { Dialog, DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { AppAbility } from '../../services/auth/auth.service';
import { ButtonModule, IconModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeDrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';

describe('DashboardFilterComponent', () => {
  let component: DashboardFilterComponent;
  let fixture: ComponentFixture<DashboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        Dialog,
        { provide: 'environment', useValue: {} },
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      declarations: [DashboardFilterComponent, SafeDrawerPositionerDirective],
      imports: [
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
