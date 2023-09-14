import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCardItemContentComponent } from './summary-card-item-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../../services/auth/auth.service';

describe('SummaryCardItemContentComponent', () => {
  let component: SummaryCardItemContentComponent;
  let fixture: ComponentFixture<SummaryCardItemContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [SummaryCardItemContentComponent],
      imports: [
        OAuthModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientModule,
        ApolloTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryCardItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
