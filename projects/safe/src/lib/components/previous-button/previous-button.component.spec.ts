import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePreviousButtonComponent } from './previous-button.component';

describe('SafePreviousButtonComponent', () => {
  let component: SafePreviousButtonComponent;
  let fixture: ComponentFixture<SafePreviousButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePreviousButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePreviousButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
