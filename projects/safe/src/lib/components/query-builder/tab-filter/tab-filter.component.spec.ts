import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabFilterComponent } from './tab-filter.component';

describe('SafeTabFilterComponent', () => {
  let component: SafeTabFilterComponent;
  let fixture: ComponentFixture<SafeTabFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeTabFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
