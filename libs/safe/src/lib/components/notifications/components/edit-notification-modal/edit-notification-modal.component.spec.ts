import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNotificationModalComponent } from './edit-notification-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { AppAbility } from '../../../../services/auth/auth.service';

describe('EditNotificationModalComponent', () => {
  let component: EditNotificationModalComponent;
  let fixture: ComponentFixture<EditNotificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      imports: [
        OAuthModule.forRoot(),
        EditNotificationModalComponent,
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
