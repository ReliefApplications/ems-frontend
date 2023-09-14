import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeResourceModalComponent } from './resource-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../services/auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeResourceModalComponent', () => {
  let component: SafeResourceModalComponent;
  let fixture: ComponentFixture<SafeResourceModalComponent>;

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
        SafeResourceModalComponent,
        DialogModule,
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
