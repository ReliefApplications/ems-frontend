import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeExpressionsComponent } from './expressions.component';
import { SelectMenuModule } from '@oort-front/ui';

describe('SafeExpressionsComponent', () => {
  let component: SafeExpressionsComponent;
  let fixture: ComponentFixture<SafeExpressionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeExpressionsComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
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
