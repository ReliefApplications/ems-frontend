import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabPaginationComponent } from './tab-pagination.component';

describe('SafeTabPaginationComponent', () => {
  let component: SafeTabPaginationComponent;
  let fixture: ComponentFixture<SafeTabPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeTabPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
