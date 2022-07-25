import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePaginatedDropdownComponent } from './paginated-dropdown.component';

describe('SafePaginatedDropdownComponent', () => {
  let component: SafePaginatedDropdownComponent;
  let fixture: ComponentFixture<SafePaginatedDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePaginatedDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePaginatedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
