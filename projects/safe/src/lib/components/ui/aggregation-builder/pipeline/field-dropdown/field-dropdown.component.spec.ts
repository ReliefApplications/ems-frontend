import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFieldDropdownComponent } from './field-dropdown.component';

describe('SafeFieldDropdownComponent', () => {
  let component: SafeFieldDropdownComponent;
  let fixture: ComponentFixture<SafeFieldDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFieldDropdownComponent],
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
