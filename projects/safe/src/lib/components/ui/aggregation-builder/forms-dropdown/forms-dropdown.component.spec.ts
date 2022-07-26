import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Form, FormArray, UntypedFormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { Observable, observable } from 'rxjs';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';

describe('SafeFormsDropdownComponent', () => {
  let component: SafeFormsDropdownComponent;
  let fixture: ComponentFixture<SafeFormsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeFormsDropdownComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MatAutocompleteModule,
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
