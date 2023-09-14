import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeFormModalComponent } from './form-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../services/auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeFormModalComponent', () => {
  let component: SafeFormModalComponent;
  let fixture: ComponentFixture<SafeFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      imports: [
        OAuthModule.forRoot(),
        DialogCdkModule,
        SafeFormModalComponent,
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
