import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Ability } from '@casl/ability';
import { RedirectComponent } from './redirect.component';

describe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        OAuthModule.forRoot(),
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
      declarations: [RedirectComponent],
      providers: [
        Ability,
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
