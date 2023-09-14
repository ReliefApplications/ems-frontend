import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeResourceGridModalComponent } from './search-resource-grid-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../services/auth/auth.service';

describe('ResourceTableModalComponent', () => {
  let component: SafeResourceGridModalComponent;
  let fixture: ComponentFixture<SafeResourceGridModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: { gridSettings: { sort: { field: [] }, fields: [] } },
        },
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      imports: [
        OAuthModule.forRoot(),
        SafeResourceGridModalComponent,
        DialogCdkModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeResourceGridModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
