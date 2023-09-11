import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTestServiceDropdownComponent } from './test-service-dropdown.component';

describe('SafeTestServiceDropdownComponent', () => {
  let component: SafeTestServiceDropdownComponent;
  let fixture: ComponentFixture<SafeTestServiceDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTestServiceDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeTestServiceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
