import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeResourceDropdownComponent } from './resource-dropdown.component';

describe('SafeResourceDropdownComponent', () => {
  let component: SafeResourceDropdownComponent;
  let fixture: ComponentFixture<SafeResourceDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeResourceDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeResourceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
