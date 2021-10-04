import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationDropdownComponent } from './application-dropdown.component';

describe('SafeApplicationDropdownComponent', () => {
  let component: SafeApplicationDropdownComponent;
  let fixture: ComponentFixture<SafeApplicationDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeApplicationDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
