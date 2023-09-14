import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonConfigComponent } from './button-config.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../../services/auth/auth.service';
import { ButtonModule, DialogModule, ToggleModule } from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('ButtonConfigComponent', () => {
  let component: ButtonConfigComponent;
  let fixture: ComponentFixture<ButtonConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [ButtonConfigComponent],
      imports: [
        DialogModule,
        OAuthModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        ToggleModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonConfigComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      show: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
