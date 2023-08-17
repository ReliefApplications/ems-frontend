import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeFieldDropdownComponent } from './field-dropdown.component';

describe('SafeFieldDropdownComponent', () => {
  let component: SafeFieldDropdownComponent;
  let fixture: ComponentFixture<SafeFieldDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeFieldDropdownComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFieldDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
