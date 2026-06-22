import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoginComponent } from './login.component';
import { AppAbility } from '@oort-front/shared';
import { SpinnerModule } from '@oort-front/ui';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SpinnerModule,
        HttpClientModule,
        OAuthModule.forRoot(),
        ApolloTestingModule,
      ],
      declarations: [LoginComponent],
      providers: [
        AppAbility,
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
