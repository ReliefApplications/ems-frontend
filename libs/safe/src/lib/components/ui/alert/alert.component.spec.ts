import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAlertComponent } from './alert.component';

describe('SafeAlertComponent', () => {
  let component: SafeAlertComponent;
  let fixture: ComponentFixture<SafeAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
