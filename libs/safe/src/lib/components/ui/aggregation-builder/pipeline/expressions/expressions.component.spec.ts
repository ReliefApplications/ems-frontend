import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeExpressionsComponent } from './expressions.component';

describe('SafeExpressionsComponent', () => {
  let component: SafeExpressionsComponent;
  let fixture: ComponentFixture<SafeExpressionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeExpressionsComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExpressionsComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      operator: new UntypedFormControl(),
      field: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
