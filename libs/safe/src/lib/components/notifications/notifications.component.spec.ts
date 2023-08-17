import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppAbility } from '../../services/auth/auth.service';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AppAbility, { provide: 'environment', useValue: {} }],
      declarations: [NotificationsComponent],
      imports: [
        OAuthModule.forRoot(),
        DialogCdkModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        SafeSkeletonTableModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
