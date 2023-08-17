import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeFilterComponent } from './filter.component';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  SelectOptionModule,
} from '@oort-front/ui';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormArray,
} from '@angular/forms';

describe('SafeFilterComponent', () => {
  let component: SafeFilterComponent;
  let fixture: ComponentFixture<SafeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule,
        SelectMenuModule,
        FormWrapperModule,
        ReactiveFormsModule,
        SelectOptionModule,
        ButtonModule,
        TranslateModule.forRoot(),
      ],
      declarations: [SafeFilterComponent, FilterGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFilterComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      filters: new UntypedFormArray([]),
      logic: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
