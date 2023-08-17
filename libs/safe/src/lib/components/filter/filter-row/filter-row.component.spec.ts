import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterRowComponent } from './filter-row.component';
import {
  ButtonModule,
  DateModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('FilterRowComponent', () => {
  let component: FilterRowComponent;
  let fixture: ComponentFixture<FilterRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterRowComponent],
      imports: [
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        FormWrapperModule,
        DateModule,
        SelectMenuModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterRowComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      field: new UntypedFormControl({}),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
