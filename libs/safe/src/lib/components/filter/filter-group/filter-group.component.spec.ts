import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterGroupComponent } from './filter-group.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  SelectOptionModule,
} from '@oort-front/ui';

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let fixture: ComponentFixture<FilterGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        SelectOptionModule,
        ButtonModule,
        FormWrapperModule,
        ReactiveFormsModule,
      ],
      declarations: [FilterGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGroupComponent);
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
