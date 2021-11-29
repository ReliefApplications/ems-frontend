import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeDropdownFilterComponent } from './dropdown-filter.component';

describe('SafeDropdownFilterComponent', () => {
  let component: SafeDropdownFilterComponent;
  let fixture: ComponentFixture<SafeDropdownFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeDropdownFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
