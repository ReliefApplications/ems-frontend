import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBuilderComponent } from './filter-builder.component';

describe('FilterBuilderComponent', () => {
  let component: FilterBuilderComponent;
  let fixture: ComponentFixture<FilterBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
