import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { SafeDropdownFilterMenuComponent } from './dropdown-filter-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

describe('SafeDropdownFilterMenuComponent', () => {
  let component: SafeDropdownFilterMenuComponent;
  let fixture: ComponentFixture<SafeDropdownFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder],
      declarations: [SafeDropdownFilterMenuComponent],
      imports: [
        TranslateModule.forRoot(),
        DropDownsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDropdownFilterMenuComponent);
    component = fixture.componentInstance;
    component.filter = {
      logic: [],
      filters: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
