import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabSortComponent } from './tab-sort.component';

describe('SafeTabSortComponent', () => {
  let component: SafeTabSortComponent;
  let fixture: ComponentFixture<SafeTabSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabSortComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
