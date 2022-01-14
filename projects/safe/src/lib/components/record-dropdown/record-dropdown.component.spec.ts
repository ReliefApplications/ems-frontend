import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRecordDropdownComponent } from './record-dropdown.component';

describe('SafeRecordDropdownComponent', () => {
  let component: SafeRecordDropdownComponent;
  let fixture: ComponentFixture<SafeRecordDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRecordDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
