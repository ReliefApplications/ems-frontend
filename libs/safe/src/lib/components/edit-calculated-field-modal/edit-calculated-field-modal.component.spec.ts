import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeEditCalculatedFieldModalComponent } from './edit-calculated-field-modal.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

describe('SafeEditCalculatedFieldModalComponent', () => {
  let component: SafeEditCalculatedFieldModalComponent;
  let fixture: ComponentFixture<SafeEditCalculatedFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        TranslateService,
        {
          provide: 'environment',
          useValue: { frontOfficeUri: 'http://a.com' },
        },
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
            resourceFields: [],
          },
        },
      ],
      imports: [
        SafeEditCalculatedFieldModalComponent,
        DialogCdkModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditCalculatedFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
