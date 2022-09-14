import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEmptyStateComponent } from './empty-state.component';

describe('SafeEmptyStateComponent', () => {
  let component: SafeEmptyStateComponent;
  let fixture: ComponentFixture<SafeEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEmptyStateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
