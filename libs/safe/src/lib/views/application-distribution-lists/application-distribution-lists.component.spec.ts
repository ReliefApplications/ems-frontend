import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationDistributionListsComponent } from './application-distribution-lists.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../../services/auth/auth.service';
import { SpinnerModule } from '@oort-front/ui';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeApplicationDistributionListsComponent', () => {
  let component: SafeApplicationDistributionListsComponent;
  let fixture: ComponentFixture<SafeApplicationDistributionListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [SafeApplicationDistributionListsComponent],
      imports: [
        OAuthModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        SpinnerModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SafeApplicationDistributionListsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
