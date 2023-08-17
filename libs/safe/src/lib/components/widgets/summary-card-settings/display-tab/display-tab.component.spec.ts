import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeDisplayTabComponent } from './display-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  IconModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('DisplayTabComponent', () => {
  let component: SafeDisplayTabComponent;
  let fixture: ComponentFixture<SafeDisplayTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDisplayTabComponent],
      imports: [
        TranslateModule.forRoot(),
        DividerModule,
        ToggleModule,
        IconModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDisplayTabComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      card: new UntypedFormGroup({
        title: new UntypedFormControl(),
        height: new UntypedFormControl(),
        width: new UntypedFormControl(),
        showDataSourceLink: new UntypedFormControl(),
      }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
