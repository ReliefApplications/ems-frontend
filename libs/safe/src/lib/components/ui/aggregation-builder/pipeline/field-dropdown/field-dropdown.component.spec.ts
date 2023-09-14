import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFieldDropdownComponent } from './field-dropdown.component';
import { SelectMenuModule } from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';

describe('SafeFieldDropdownComponent', () => {
  let component: SafeFieldDropdownComponent;
  let fixture: ComponentFixture<SafeFieldDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFieldDropdownComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFieldDropdownComponent);
    component = fixture.componentInstance;
    component.fieldControl = new UntypedFormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
