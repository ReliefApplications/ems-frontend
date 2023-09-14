import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeEditorComponent } from './editor.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../../../services/auth/auth.service';
import { DialogModule } from '@oort-front/ui';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeEditorComponent', () => {
  let component: SafeEditorComponent;
  let fixture: ComponentFixture<SafeEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [SafeEditorComponent],
      imports: [
        OAuthModule.forRoot(),
        DialogModule,
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditorComponent);
    component = fixture.componentInstance;
    component.settings = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
