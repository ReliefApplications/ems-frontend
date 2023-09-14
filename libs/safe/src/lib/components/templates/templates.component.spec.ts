import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeTemplatesComponent } from './templates.component';
import { ButtonModule, MenuModule } from '@oort-front/ui';
import { SafeApplicationService } from '../../services/application/application.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../services/auth/auth.service';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeTemplatesComponent', () => {
  let component: SafeTemplatesComponent;
  let fixture: ComponentFixture<SafeTemplatesComponent>;
  let mockSafeApplicationService: SafeApplicationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        SafeApplicationService,
        AppAbility,
      ],
      declarations: [SafeTemplatesComponent],
      imports: [
        OAuthModule.forRoot(),
        HttpClientModule,
        DialogCdkModule,
        SafeEmptyModule,
        ButtonModule,
        TranslateModule.forRoot(),
        MenuModule,
        ApolloTestingModule,
      ],
    }).compileComponents();

    mockSafeApplicationService = TestBed.inject(SafeApplicationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTemplatesComponent);
    component = fixture.componentInstance;
    component.applicationService = mockSafeApplicationService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
