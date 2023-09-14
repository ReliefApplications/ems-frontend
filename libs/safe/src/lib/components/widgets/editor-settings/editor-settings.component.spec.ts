import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeEditorSettingsComponent } from './editor-settings.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../services/auth/auth.service';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SafeEditorSettingsComponent', () => {
  let component: SafeEditorSettingsComponent;
  let fixture: ComponentFixture<SafeEditorSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: { frontOfficeUri: 'http://.' } },
        AppAbility,
      ],
      declarations: [SafeEditorSettingsComponent],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        TabsModule,
        IconModule,
        TooltipModule,
        OAuthModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditorSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      id: '',
      settings: {
        title: '',
        text: '',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
