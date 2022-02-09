import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeArrayFilterComponent } from './array-filter.component';

describe('SafeArrayFilterComponent', () => {
  let component: SafeArrayFilterComponent;
  let fixture: ComponentFixture<SafeArrayFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeArrayFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeArrayFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
