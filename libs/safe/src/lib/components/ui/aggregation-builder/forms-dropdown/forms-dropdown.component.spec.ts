import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { AutocompleteModule } from '@oort-front/ui';

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
        AutocompleteModule,
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
