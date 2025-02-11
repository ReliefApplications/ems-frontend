import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggersResourceFiltersComponent } from './triggers-resource-filters.component';

describe('TriggersResourceFiltersComponent', () => {
  let component: TriggersResourceFiltersComponent;
  let fixture: ComponentFixture<TriggersResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriggersResourceFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggersResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
