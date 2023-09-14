import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeTextEditorTabComponent } from './text-editor-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../../services/auth/auth.service';
import { AlertModule } from '@oort-front/ui';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('TextEditorTabComponent', () => {
  let component: SafeTextEditorTabComponent;
  let fixture: ComponentFixture<SafeTextEditorTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: { frontOfficeUri: 'http://.' } },
        AppAbility,
      ],
      declarations: [SafeTextEditorTabComponent],
      imports: [
        OAuthModule.forRoot(),
        TranslateModule.forRoot(),
        AlertModule,
        EditorModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ApolloTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTextEditorTabComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      card: new UntypedFormGroup({ html: new UntypedFormControl() }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
