import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFilterComponent } from './filter.component';

describe('SafeFilterComponent', () => {
  let component: SafeFilterComponent;
  let fixture: ComponentFixture<SafeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
