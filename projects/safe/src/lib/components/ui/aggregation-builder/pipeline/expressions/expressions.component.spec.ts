import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeExpressionsComponent } from './expressions.component';

describe('SafeExpressionsComponent', () => {
  let component: SafeExpressionsComponent;
  let fixture: ComponentFixture<SafeExpressionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeExpressionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExpressionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
