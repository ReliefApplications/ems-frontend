import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeDropdownFilterMenuComponent } from './dropdown-filter-menu.component';

describe('SafeDropdownFilterMenuComponent', () => {
  let component: SafeDropdownFilterMenuComponent;
  let fixture: ComponentFixture<SafeDropdownFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDropdownFilterMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDropdownFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
