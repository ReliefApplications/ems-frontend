import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SafeTabSortComponent } from './tab-sort.component';
import { FormWrapperModule, SelectMenuModule } from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('SafeTabSortComponent', () => {
  let component: SafeTabSortComponent;
  let fixture: ComponentFixture<SafeTabSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabSortComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
        FormWrapperModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabSortComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      sort: new UntypedFormControl({ field: [''] }),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
