import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFormActionsComponent } from './form-actions.component';

describe('SafeFormActionsComponent', () => {
  let component: SafeFormActionsComponent;
  let fixture: ComponentFixture<SafeFormActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFormActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
