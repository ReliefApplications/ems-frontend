import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeExportComponent } from './export.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

describe('SafeExportComponent', () => {
  let component: SafeExportComponent;
  let fixture: ComponentFixture<SafeExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        {
          provide: DIALOG_DATA,
          useValue: { export: { records: '', fields: '', format: '' } },
        },
        TranslateService,
      ],
      declarations: [SafeExportComponent],
      imports: [
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
    fixture = TestBed.createComponent(SafeExportComponent);
    component = fixture.componentInstance;
    component.export = { records: '', fields: '', format: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
