import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeEmailPreviewComponent } from './email-preview.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ChipModule,
  DialogModule,
  ErrorMessageModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ButtonModule } from '@oort-front/ui';

describe('SafeEmailPreviewComponent', () => {
  let component: SafeEmailPreviewComponent;
  let fixture: ComponentFixture<SafeEmailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: 'environment',
          useValue: {
            frontOfficeUri: 'http://.',
          },
        },
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
        UntypedFormBuilder,
      ],
      declarations: [SafeEmailPreviewComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        UploadsModule,
        FormWrapperModule,
        ChipModule,
        HttpClientModule,
        EditorModule,
        ErrorMessageModule,
        ButtonModule,
        ApolloTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEmailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
