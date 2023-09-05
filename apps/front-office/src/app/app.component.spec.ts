import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Ability } from '@casl/ability';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        OAuthModule.forRoot(),
        DialogCdkModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
      declarations: [AppComponent],
      providers: [
        Ability,
        {
          provide: 'environment',
          useValue: environment,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'front-office'`, () => {
    expect(component.title).toEqual('front-office');
  });
});
