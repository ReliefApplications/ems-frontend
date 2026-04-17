import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { EditCalculatedFieldModalComponent } from './edit-calculated-field-modal.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { getDataKeys } from './utils/keys';

describe('EditCalculatedFieldModalComponent', () => {
  let component: EditCalculatedFieldModalComponent;
  let fixture: ComponentFixture<EditCalculatedFieldModalComponent>;
  const dialogRefMock = {
    addPanelClass: jest.fn(),
    close: jest.fn(),
    removePanelClass: jest.fn(),
    updateSize: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        TranslateService,
        { provide: 'environment', useValue: {} },
        { provide: DialogRef, useValue: dialogRefMock },
        {
          provide: DIALOG_DATA,
          useValue: {
            calculatedField: null,
            resourceFields: [],
          },
        },
      ],
      imports: [
        EditCalculatedFieldModalComponent,
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
    jest.clearAllMocks();
    fixture = TestBed.createComponent(EditCalculatedFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should suggest raw and text data keys', () => {
    expect(getDataKeys([{ name: 'country' }])).toEqual([
      '{{data.country}}',
      '{{data.country:text}}',
    ]);
  });
});
