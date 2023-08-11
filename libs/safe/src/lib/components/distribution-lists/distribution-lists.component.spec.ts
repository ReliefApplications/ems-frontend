import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistributionListsComponent } from './distribution-lists.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SafeApplicationService } from '../../services/application/application.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { AppAbility } from '../../services/auth/auth.service';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { ButtonModule } from '@oort-front/ui';

describe('DistributionListsComponent', () => {
  let component: DistributionListsComponent;
  let fixture: ComponentFixture<DistributionListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        Dialog,
        TranslateService,
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      declarations: [DistributionListsComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        ButtonModule,
        SafeEmptyModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionListsComponent);
    component = fixture.componentInstance;
    component.applicationService = TestBed.inject(SafeApplicationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
