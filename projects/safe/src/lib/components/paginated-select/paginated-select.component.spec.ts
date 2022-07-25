import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePaginatedSelectComponent } from './paginated-select.component';

describe('SafePaginatedSelectComponent', () => {
  let component: SafePaginatedSelectComponent;
  let fixture: ComponentFixture<SafePaginatedSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePaginatedSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePaginatedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
