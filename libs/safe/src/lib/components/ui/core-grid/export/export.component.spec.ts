import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeExportComponent } from './export.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  RadioModule,
  TooltipModule,
  ToggleModule,
  ButtonModule,
  IconModule,
  DialogModule,
} from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SafeExportComponent', () => {
  let component: SafeExportComponent;
  let fixture: ComponentFixture<SafeExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: { export: { records: '', fields: '', format: '' } },
        },
      ],
      declarations: [SafeExportComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        TooltipModule,
        ToggleModule,
        RadioModule,
        ButtonModule,
        IconModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExportComponent);
    component = fixture.componentInstance;
    component.export = { records: '', fields: '', format: '', email: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
