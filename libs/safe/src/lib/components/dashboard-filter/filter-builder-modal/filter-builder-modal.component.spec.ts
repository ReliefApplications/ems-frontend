import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBuilderModalComponent } from './filter-builder-modal.component';

describe('FilterBuilderComponent', () => {
  let component: FilterBuilderModalComponent;
  let fixture: ComponentFixture<FilterBuilderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterBuilderModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBuilderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
