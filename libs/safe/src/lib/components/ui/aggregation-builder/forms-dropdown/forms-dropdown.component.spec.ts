import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { AutocompleteModule, SpinnerModule } from '@oort-front/ui';

describe('SafeFormsDropdownComponent', () => {
  let component: SafeFormsDropdownComponent;
  let fixture: ComponentFixture<SafeFormsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFormsDropdownComponent],
      imports: [
        TranslateModule.forRoot(),
        AutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormsDropdownComponent);
    component = fixture.componentInstance;
    component.sourceControl = new UntypedFormControl();
    component.forms$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
